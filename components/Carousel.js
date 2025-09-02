// components/Carousel.js
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Carousel horizontal robusto (desktop + mobile)
 * Props:
 * - items: [{ id, title, desc, img, href, icon }]
 * - minSlides: número base de slides por viewport (opcional)
 */
export default function Carousel({ items = [], minSlides = 1 }) {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [slidesPerView, setSlidesPerView] = useState(minSlides);
  const [slideWidth, setSlideWidth] = useState(300);
  const [firstIndex, setFirstIndex] = useState(0);

  // detectar si es dispositivo táctil (se mantiene por si lo querés usar)
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // gap entre slides en px (mismo valor usado en CSS)
  const GAP = 24;

  // recalcula slidesPorVista segun ancho
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

  // detectar si es dispositivo táctil
  useEffect(() => {
    if (typeof window === "undefined") return;
    const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0 || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
    setIsTouchDevice(Boolean(touch));
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

  // medidas útiles
  const slideTotal = slideWidth + GAP;
  const maxFirstIndex = Math.max(0, items.length - slidesPerView);

  // scrollToIndex (clamped al maxLeft real)
  function scrollToIndex(idx) {
    const el = trackRef.current;
    if (!el) return;
    const index = Math.max(0, Math.min(idx, maxFirstIndex));
    const desiredLeft = index * slideTotal;
    const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    const left = Math.min(desiredLeft, maxLeft);
    el.scrollTo({ left, behavior: "smooth" });
    setFirstIndex(index);
  }

  function prev() {
    scrollToIndex(Math.max(0, firstIndex - 1));
  }
  function next() {
    scrollToIndex(Math.min(maxFirstIndex, firstIndex + 1));
  }

  // SWIPE (solo TOUCH): permite avance máximo ±1 por swipe
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isTouch) return;

    let dragging = false;
    let startX = 0;
    let lastX = 0;
    let startScrollLeft = 0;
    let startIndex = 0;

    const onDown = (e) => {
      dragging = true;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      lastX = startX;
      startScrollLeft = el.scrollLeft || 0;
      startIndex = Math.round((startScrollLeft || 0) / (slideTotal || 1));
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
      const absDx = Math.abs(dx);
      const threshold = (el.clientWidth || window.innerWidth) * 0.12;

      const cur = el.scrollLeft || 0;
      const finalIndex = Math.round((cur || 0) / (slideTotal || 1));
      let delta = finalIndex - startIndex;

      if (absDx >= threshold) {
        if (delta === 0) {
          delta = dx < 0 ? 1 : -1;
        }
        delta = Math.max(-1, Math.min(1, delta));
      } else {
        delta = 0;
      }

      const target = Math.max(0, Math.min(maxFirstIndex, startIndex + delta));
      const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth);
      const left = Math.min(target * slideTotal, maxLeft);

      el.scrollTo({ left, behavior: "smooth" });
      setTimeout(() => {
        el.style.scrollSnapType = "x mandatory";
        el.style.scrollBehavior = "";
      }, 120);
      setFirstIndex(target);
    };

    el.addEventListener("touchstart", onDown, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onUp);
    window.addEventListener("touchcancel", onUp);

    return () => {
      el.removeEventListener("touchstart", onDown);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onUp);
      window.removeEventListener("touchcancel", onUp);
      el.style.scrollSnapType = "x mandatory";
      el.style.scrollBehavior = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideTotal, slidesPerView, items.length, vw, maxFirstIndex]);

  // sincronizar índice con scroll real (con debounce para estabilidad)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    let debounceTimeout = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        window.clearTimeout(debounceTimeout);
        debounceTimeout = window.setTimeout(() => {
          const cur = el.scrollLeft || 0;
          const idx = Math.round((cur || 0) / (slideTotal || 1));
          const clamped = Math.max(0, Math.min(idx, maxFirstIndex));
          setFirstIndex((prev) => (prev !== clamped ? clamped : prev));
        }, 80);
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      window.clearTimeout(debounceTimeout);
    };
  }, [slideTotal, items.length, slidesPerView, vw, maxFirstIndex]);

  // mostrar flechas si hay más items que los visibles
  const showArrows = items.length > slidesPerView;
  const leftVisible = showArrows && firstIndex > 0;
  const rightVisible = showArrows && firstIndex < maxFirstIndex;
  const dotsCount = Math.max(1, maxFirstIndex + 1);

  return (
    <div className="relative">
      <div ref={containerRef} className="max-w-6xl mx-auto px-6 relative">
        {/* Flechas: en mobile floatan fuera con negative offset (-left / -right),
            en md+ vuelven a su posición interna (md:left-2 / md:right-2).
            También tamaño ligeramente menor en mobile (w-9 h-9). */}
        <button
          aria-label="Anterior"
          onClick={prev}
          className={`absolute top-1/2 -translate-y-1/2 z-30 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white text-primary shadow-md flex items-center justify-center transition-transform hover:scale-105 ${
            leftVisible ? "" : "hidden"
          } -left-4 md:left-2`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          aria-label="Siguiente"
          onClick={next}
          className={`absolute top-1/2 -translate-y-1/2 z-30 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white text-primary shadow-md flex items-center justify-center transition-transform hover:scale-105 ${
            rightVisible ? "" : "hidden"
          } -right-4 md:right-2`}
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
            touchAction: "pan-y",
            paddingLeft: 0,
            paddingRight: 0,
          }}
          role="region"
          aria-label="Carrusel de servicios"
        >
          {items.map((s, idx) => {
            const w = slideWidth;

            // --- ICON: usa s.icon si está, sino deriva del título ---
            const deriveFilename = (title = "") =>
              "/" +
              title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-") +
              ".svg";
            const iconSrc = s.icon ? s.icon : deriveFilename(s.title);

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

                {/* TEXTO: items-start para que, si el título ocupa 2 líneas, todo quede alineado arriba */}
                <div className="p-4 flex-1 flex flex-col items-start">
                  {/* fila: icon + title */}
                  <div className="flex items-start w-full">
                    {/* icon wrapper */}
                    <div className="w-6 h-6 flex-shrink-0 overflow-hidden rounded">
                      {/* Zoom visual para compensar whitespace en algunos SVGs */}
                      <img
                        src={iconSrc}
                        alt={s.title + " icon"}
                        className="block w-5 h-5 object-contain transform"
                        onError={(e) => {
                          // si no existe el svg derivado, ocultar la imagen para no romper el layout
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>

                    <h4 className="font-semibold text-lg leading-snug break-words">
                      {s.title}
                    </h4>
                  </div>

                  <p className="text-sm text-gray-600 mt-2 flex-1 w-full">{s.desc}</p>

                  <div className="mt-4 w-full">
                    <a href={s.href} className="inline-block text-sm font-medium text-primary underline-offset-2 hover:underline">
                      Ver más &rarr;
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Dots */}
        {dotsCount > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            {Array.from({ length: dotsCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={`Ir al paso ${i + 1}`}
                className={`w-2 h-2 rounded-full ${i === firstIndex ? "bg-primary" : "bg-gray-300"} transition`}
              />
            ))}
          </div>
        )}
      </div>

      {/* estilo scrollbar (opcional) */}
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
