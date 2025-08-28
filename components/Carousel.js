// components/Carousel.js
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Carousel horizontal robusto (desktop + mobile)
 * Props:
 * - items: [{ id, title, desc, img, href }]
 * - minSlides: número base de slides por viewport (opcional)
 */
export default function Carousel({ items = [], minSlides = 1 }) {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [slidesPerView, setSlidesPerView] = useState(minSlides);
  const [slideWidth, setSlideWidth] = useState(300);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [positions, setPositions] = useState([0]); // array con los left targets por página

  // gap entre slides en px (mismo valor usado en CSS)
  const GAP = 24;

  // decide slidesPerView según ancho viewport
  useEffect(() => {
    const calcSPV = (w) => {
      if (w < 640) return 1;
      if (w < 768) return 2;
      if (w < 1024) return 3;
      if (w < 1280) return 4;
      return 5;
    };
    const onResize = () => {
      const w = window.innerWidth;
      setVw(w);
      setSlidesPerView(calcSPV(w));
    };
    onResize();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  // calcular slideWidth basado en ancho real del track/container, restando gaps
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const recalc = () => {
      const cw = el.clientWidth || (containerRef.current?.clientWidth ?? window.innerWidth);
      const totalGap = GAP * (slidesPerView - 1);
      const available = Math.max(0, cw - totalGap);
      const w = Math.floor(available / slidesPerView);
      setSlideWidth(w);
    };

    recalc();
    let ro;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(recalc);
      ro.observe(el);
    } else {
      window.addEventListener("resize", recalc);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", recalc);
    };
  }, [slidesPerView, vw]);

  // recalcula posiciones/páginas usando el ancho visible real (viewportWidth)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const recompute = () => {
      const viewportWidth = el.clientWidth || (containerRef.current?.clientWidth ?? window.innerWidth);
      const totalWidth = el.scrollWidth || 0;
      const maxLeft = Math.max(0, totalWidth - viewportWidth);

      // número de páginas estimado (páginas por viewport width)
      const pCount = viewportWidth > 0 ? Math.max(1, Math.ceil(totalWidth / viewportWidth)) : 1;

      // construyo array de posiciones: i * viewportWidth, pero la última es maxLeft
      const pos = [];
      for (let i = 0; i < pCount; i++) {
        pos.push(Math.min(i * viewportWidth, maxLeft));
      }
      if (pos.length > 0) pos[pos.length - 1] = maxLeft;

      setPositions(pos);
      setPages(pos.length);
      setPage((prev) => Math.min(prev, Math.max(0, pos.length - 1)));
    };

    recompute();
    let ro;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(recompute);
      ro.observe(el);
    } else {
      window.addEventListener("resize", recompute);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", recompute);
    };
  }, [slidesPerView, slideWidth, items.length, vw]);

  // Helpers: page behavior (desktop)
  const scrollToPage = (p) => {
    const el = trackRef.current;
    if (!el) return;
    const target = Math.max(0, Math.min(p, Math.max(0, positions.length - 1)));
    const left = positions[target] ?? 0;
    setPage(target);
    el.scrollTo({ left, behavior: "smooth" });
  };
  const prevPage = () => scrollToPage(Math.max(0, page - 1));
  const nextPage = () => scrollToPage(Math.min((positions.length || 1) - 1, page + 1));

  // Helpers: slide-by-slide (mobile)
  const slideTotal = slideWidth + GAP;
  const maxFirstSlideIndex = Math.max(0, items.length - slidesPerView);
  const getCurrentSlideIndex = () => {
    const el = trackRef.current;
    if (!el) return 0;
    return Math.round((el.scrollLeft || 0) / (slideTotal || 1));
  };
  const scrollToSlide = (index) => {
    const el = trackRef.current;
    if (!el) return;
    const firstIndex = Math.max(0, Math.min(index, maxFirstSlideIndex));
    const desiredLeft = firstIndex * slideTotal;
    const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    const left = Math.min(desiredLeft, maxLeft);
    el.scrollTo({ left, behavior: "smooth" });
  };
  const prevSlide = () => {
    const cur = getCurrentSlideIndex();
    scrollToSlide(Math.max(0, cur - 1));
  };
  const nextSlide = () => {
    const cur = getCurrentSlideIndex();
    scrollToSlide(Math.min(maxFirstSlideIndex, cur + 1));
  };

  // Decide móviles vs desktop (umbral)
  const isMobile = vw < 768;

  // swipe / drag handling
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let dragging = false;
    let startX = 0;
    let lastX = 0;

    const onDown = (e) => {
      dragging = true;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      lastX = startX;
      el.style.scrollBehavior = "auto";
      el.style.scrollSnapType = "none";
    };
    const onMove = (e) => {
      if (!dragging) return;
      lastX = e.touches ? e.touches[0].clientX : e.clientX;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      const dx = lastX - startX;
      const threshold = (el.clientWidth || window.innerWidth) * 0.12; // 12% mejor para mobile
      if (isMobile) {
        if (dx < -threshold) {
          nextSlide();
        } else if (dx > threshold) {
          prevSlide();
        } else {
          // snap to nearest slide
          const cur = el.scrollLeft || 0;
          const nearest = Math.round(cur / (slideTotal || 1));
          scrollToSlide(nearest);
        }
      } else {
        // comportamiento por páginas en desktop
        if (dx < -threshold) nextPage();
        else if (dx > threshold) prevPage();
        else {
          const cur = el.scrollLeft || 0;
          // elegir la posición más cercana de positions[]
          if (positions && positions.length) {
            let nearest = 0;
            let md = Infinity;
            positions.forEach((pos, i) => {
              const d = Math.abs(cur - pos);
              if (d < md) {
                md = d;
                nearest = i;
              }
            });
            scrollToPage(nearest);
          }
        }
      }

      setTimeout(() => {
        el.style.scrollSnapType = "x mandatory";
        el.style.scrollBehavior = "";
      }, 120);
    };

    el.addEventListener("touchstart", onDown, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onUp);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("touchcancel", onUp);

    return () => {
      el.removeEventListener("touchstart", onDown);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onUp);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("touchcancel", onUp);
      el.style.scrollSnapType = "x mandatory";
      el.style.scrollBehavior = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slidesPerView, page, items.length, slideWidth, vw, positions]);

  // sincronizar page con scroll real: buscar posición más cercana en positions[]
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const cur = el.scrollLeft || 0;
        if (isMobile) {
          // en móvil no queremos tocar "pages" (que están basadas en viewportWidth),
          // pero podemos dejar sincronizar 'page' con el índice de página basada en positions
          if (positions && positions.length) {
            let nearest = 0;
            let md = Infinity;
            positions.forEach((pos, i) => {
              const d = Math.abs(cur - pos);
              if (d < md) {
                md = d;
                nearest = i;
              }
            });
            const clamped = Math.max(0, Math.min(nearest, Math.max(0, positions.length - 1)));
            setPage((prev) => (prev !== clamped ? clamped : prev));
          }
        } else {
          // desktop: normal (posiciones por viewport)
          if (positions && positions.length) {
            let nearest = 0;
            let md = Infinity;
            positions.forEach((pos, i) => {
              const d = Math.abs(cur - pos);
              if (d < md) {
                md = d;
                nearest = i;
              }
            });
            const clamped = Math.max(0, Math.min(nearest, Math.max(0, positions.length - 1)));
            setPage((prev) => (prev !== clamped ? clamped : prev));
          }
        }
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [positions, slideWidth, isMobile]);

  // mostrar flechas en pantallas razonables
  const showArrows = vw >= 420;

  // visibilidad según extremos para páginas (desktop); en móvil no se muestran flechas normalmente
  const leftVisible = showArrows && page > 0;
  const rightVisible = showArrows && page < (positions.length - 1);

  // Flechas externas: siguen moviendo por páginas (desktop). En mobile las flechas están ocultas por showArrows.
  const handlePrev = () => {
    if (isMobile) prevSlide();
    else prevPage();
  };
  const handleNext = () => {
    if (isMobile) nextSlide();
    else nextPage();
  };

  return (
    <div className="relative">
      {/* wrapper que respeta márgenes globales */}
      <div ref={containerRef} className="max-w-6xl mx-auto px-6 relative">
        {/* flechas: ahora ocultas cuando en extremos */}
        <button
          aria-label="Anterior"
          onClick={handlePrev}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white text-primary shadow-md flex items-center justify-center transition-transform hover:scale-105 ${
            leftVisible ? "" : "hidden"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          aria-label="Siguiente"
          onClick={handleNext}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white text-primary shadow-md flex items-center justify-center transition-transform hover:scale-105 ${
            rightVisible ? "" : "hidden"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* TRACK */}
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory touch-pan-x py-2 scroll-smooth"
          style={{
            WebkitOverflowScrolling: "touch",
            paddingLeft: 0,
            paddingRight: 0,
          }}
          role="region"
          aria-label="Carrusel de servicios"
        >
          {items.map((s, idx) => {
            const w = slideWidth;
            return (
              <article
                key={s.id ?? idx}
                className="snap-start bg-white/95 text-primary rounded-lg shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 transition flex-shrink-0"
                style={{
                  flex: `0 0 ${w}px`,
                  width: `${w}px`,
                }}
              >
                <div className="h-36 w-full overflow-hidden bg-gray-100 flex items-start justify-center">
                  {s.img ? (
                    <img src={s.img} alt={s.title} className="object-cover object-top w-full h-full" />
                  ) : (
                    <div className="text-sm text-gray-500">Imagen</div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-semibold text-lg">{s.title}</h4>
                  <p className="text-sm text-gray-600 mt-2 flex-1">{s.desc}</p>

                  <div className="mt-4">
                    <a href={s.href} className="inline-block text-sm font-medium text-primary underline-offset-2 hover:underline">
                      Ver más &rarr;
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Dots / paginación (solo si hay >1 páginas) */}
        {pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToPage(i)}
                aria-label={`Ir a la página ${i + 1}`}
                className={`w-2 h-2 rounded-full ${i === page ? "bg-primary" : "bg-gray-300"} transition`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Oculta / estiliza scrollbar (opcional) */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          height: 10px;
        }
        .no-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.08);
          border-radius: 9999px;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: thin;
        }
      `}</style>
    </div>
  );
}
