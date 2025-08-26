// components/Carousel.js
import { useEffect, useRef, useState } from "react";

/**
 * Carousel mejorado (preparado para mobile swipe estable)
 * Props:
 * - items: array [{id,title,desc,img,href}]
 * - minGridBreakpoint: px desde el cuál querrás mostrar grid (opcional). Default 768 (md).
 */
export default function Carousel({ items = [], minGridBreakpoint = 768 }) {
  const trackRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [page, setPage] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const resizeObserverRef = useRef(null);

  useEffect(() => {
    const calcSPV = (w) => {
      if (w < 640) return 1;
      if (w < 768) return 2;
      if (w < 1024) return 3;
      if (w < 1280) return 4;
      return 5;
    };

    const update = () => {
      const w = window.innerWidth;
      setViewportWidth(w);
      const spv = calcSPV(w);
      setSlidesPerView(spv);
      // recalc slideWidth based on actual container width
      const el = trackRef.current;
      if (el) {
        const cw = el.clientWidth || window.innerWidth;
        setSlideWidth(Math.floor(cw / spv));
      }
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  // keep slideWidth updated with ResizeObserver (handles dynamic container sizes)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    // initial calc
    const recalc = () => {
      const cw = el.clientWidth || window.innerWidth;
      setSlideWidth(Math.floor(cw / slidesPerView));
    };
    recalc();

    if ("ResizeObserver" in window) {
      resizeObserverRef.current = new ResizeObserver(recalc);
      resizeObserverRef.current.observe(el);
    } else {
      // fallback
      window.addEventListener("resize", recalc);
    }
    return () => {
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      else window.removeEventListener("resize", recalc);
    };
  }, [slidesPerView]);

  // number of pages
  const pages = Math.max(1, Math.ceil(items.length / slidesPerView));

  const scrollToPage = (p) => {
    const el = trackRef.current;
    if (!el) return;
    const targetPage = Math.max(0, Math.min(p, pages - 1));
    const left = targetPage * el.clientWidth;
    el.scrollTo({ left, behavior: "smooth" });
    setPage(targetPage);
  };

  const prev = () => scrollToPage(page - 1);
  const next = () => scrollToPage(page + 1);

  // Pointer / swipe handling bound to the track. More stable on mobile.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let down = false;
    let startX = 0;
    let lastX = 0;
    // We disable native scroll snap while dragging and restore after.
    const onDown = (e) => {
      down = true;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      lastX = startX;
      // stop native momentum
      el.style.scrollBehavior = "auto";
      el.style.scrollSnapType = "none";
    };
    const onMove = (e) => {
      if (!down) return;
      lastX = e.touches ? e.touches[0].clientX : e.clientX;
      // let the browser handle the actual scroll by default (we're not calling preventDefault)
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      const dx = lastX - startX;
      const threshold = (el.clientWidth || window.innerWidth) * 0.15; // 15% of viewport
      if (dx < -threshold) {
        next();
      } else if (dx > threshold) {
        prev();
      } else {
        // snap to nearest page
        // determine nearest page by current scrollLeft
        const cur = el.scrollLeft || 0;
        const approxPage = Math.round(cur / el.clientWidth);
        scrollToPage(approxPage);
      }
      // restore snapping and smooth behavior
      setTimeout(() => {
        el.style.scrollSnapType = "x mandatory";
        el.style.scrollBehavior = "";
      }, 120);
    };

    // Use passive: false for touchstart if we'd call preventDefault (we don't here),
    // keep default passive true to avoid warnings. Binding to element only.
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, slidesPerView, items.length]);

  // Hide arrows on very small viewports but keep accessible for keyboard users.
  const showArrows = viewportWidth >= 420;

  // determine whether to use grid-like rendering on large screens (keeps desktop behavior)
  const useGridOnDesktop = viewportWidth >= minGridBreakpoint;

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        onClick={prev}
        aria-label="Anterior"
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-primary shadow-md hover:scale-105 transform transition flex items-center justify-center ${
          showArrows ? "" : "hidden"
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        onClick={next}
        aria-label="Siguiente"
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-primary shadow-md hover:scale-105 transform transition flex items-center justify-center ${
          showArrows ? "" : "hidden"
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Track */}
      <div
        ref={trackRef}
        className={`overflow-x-auto no-scrollbar snap-x snap-mandatory touch-pan-x px-2 py-2 ${
          useGridOnDesktop ? "md:overflow-visible md:flex md:flex-row md:gap-6" : "flex"
        }`}
        style={{
          // ensure consistent height on mobile (cards will adapt inside). Remove if you want auto-height.
          WebkitOverflowScrolling: "touch",
        }}
      >
        {items.map((s, idx) => {
          const isGrid = useGridOnDesktop;
          const style = isGrid
            ? { width: `${Math.floor(100 / Math.min(items.length, 5))}%`, minWidth: 0 } // let CSS layout on desktop
            : { flex: `0 0 ${slideWidth}px`, width: `${slideWidth}px` };

          return (
            <article
              key={s.id || idx}
              className="snap-start bg-white/95 text-primary rounded-lg shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 transition flex-shrink-0"
              style={style}
            >
              <div className="h-36 md:h-40 w-full overflow-hidden rounded-t-lg bg-gray-100 flex items-center justify-center">
                {s.img ? (
                  // plain img for plug&play; podés cambiar a <Image/> si querés
                  <img src={s.img} alt={s.title} className="object-cover w-full h-full" />
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

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToPage(i)}
            aria-label={`Ir a la página ${i + 1}`}
            className={`w-2 h-2 rounded-full ${i === page ? "bg-primary" : "bg-gray-300"} transition`}
          />
        ))}
      </div>
    </div>
  );
}
