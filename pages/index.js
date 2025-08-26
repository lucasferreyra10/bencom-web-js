// pages/index.js
"use client";

import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";

/**
 * Carousel reutilizable
 * Props:
 * - items: array de objetos { id, title, desc, img, href }
 * - breakpoints: función opcional para definir slidesPerView según width
 */
function Carousel({ items = [] }) {
  const trackRef = useRef(null);
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [page, setPage] = useState(0);

  // responsive:  <640:1, 640-767:2, 768-1023:3, 1024-1279:4, >=1280:5
  const calcSlides = (w) => {
    if (w < 640) return 1;
    if (w < 768) return 2;
    if (w < 1024) return 3;
    if (w < 1280) return 4;
    return 5;
  };

  useEffect(() => {
    const onResize = () => {
      setWidth(window.innerWidth);
      const newSPV = calcSlides(window.innerWidth);
      setSlidesPerView(newSPV);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // when slidesPerView changes, reset page to 0 and scroll start
  useEffect(() => {
    setPage(0);
    if (trackRef.current) trackRef.current.scrollTo({ left: 0, behavior: "smooth" });
  }, [slidesPerView, items.length]);

  const pages = Math.max(1, Math.ceil(items.length / slidesPerView));

  // scroll to page
  const scrollToPage = (p) => {
    if (!trackRef.current) return;
    const containerW = trackRef.current.clientWidth;
    const left = Math.min(Math.max(0, p), pages - 1) * containerW;
    trackRef.current.scrollTo({ left, behavior: "smooth" });
    setPage(Math.min(Math.max(0, p), pages - 1));
  };

  const prev = () => scrollToPage(page - 1);
  const next = () => scrollToPage(page + 1);

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, pages, trackRef.current, slidesPerView]);

  // swipe / pointer
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let startX = 0;
    let lastX = 0;
    let down = false;

    const onPointerDown = (ev) => {
      down = true;
      startX = ev.clientX ?? (ev.touches && ev.touches[0].clientX) ?? 0;
      lastX = startX;
      el.style.scrollSnapType = "none"; // disable snap while dragging
    };
    const onPointerMove = (ev) => {
      if (!down) return;
      lastX = ev.clientX ?? (ev.touches && ev.touches[0].clientX) ?? lastX;
    };
    const onPointerUp = () => {
      if (!down) return;
      down = false;
      const dx = lastX - startX;
      // threshold
      if (dx < -50) {
        // swipe left -> next
        next();
      } else if (dx > 50) {
        // swipe right -> prev
        prev();
      } else {
        // small movement, snap to nearest page
        scrollToPage(page);
      }
      // restore snap after small delay
      setTimeout(() => (el.style.scrollSnapType = "x mandatory"), 100);
    };

    // pointer events: support touch & mouse
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // fallback for touch-only browsers
    el.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
    };
  }, [page, slidesPerView, pages]);

  // If on large screens, we prefer to show grid-like layout (no horizontal scroll)
  const isLarge = width >= 768; // treat md+ as grid (change breakpoint as you wish)

  return (
    <div className="relative">
      {/* Flechas */}
      <button
        aria-label="Anterior"
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 text-primary shadow-md hover:scale-105 transform transition hidden sm:flex items-center justify-center"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        aria-label="Siguiente"
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 text-primary shadow-md hover:scale-105 transform transition hidden sm:flex items-center justify-center"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div
        ref={trackRef}
        className={`flex gap-4 overflow-x-auto snap-x snap-mandatory px-2 py-2
                    ${isLarge ? "md:overflow-visible md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6" : ""}
                    `}
        // make slides have the correct width by using percentage flex-basis
      >
        {items.map((s) => (
          <article
            key={s.id}
            className={`snap-start flex-shrink-0 ${isLarge ? "md:flex-grow-0 md:min-w-0" : ""} 
                        bg-white/95 text-primary rounded-lg shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 transition
                        `}
            style={{
              flex: isLarge ? "0 0 auto" : `0 0 ${100 / slidesPerView}%`,
              minWidth: isLarge ? undefined : `${Math.floor((100 / slidesPerView) * 100) / 100}%`,
            }}
          >
            <div className="h-36 md:h-28 lg:h-32 w-full overflow-hidden rounded-t-lg bg-gray-100 flex items-center justify-center">
              {s.img ? (
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
        ))}
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

/* --------------------------
  Datos de servicios (ajustalos)
   - Guarda imágenes en public/servicios/ (opcional)
----------------------------*/
const SERVICIOS = [
  {
    id: "destapaciones",
    title: "Destapaciones",
    desc: "Cloacas, pluviales, cocinas y lavaderos — atención a consorcios, restaurantes y domicilios.",
    img: "/servicios/destapaciones.jpg",
    href: "/servicios#destapaciones",
  },
  {
    id: "obra-civil-menor",
    title: "Obra civil menor",
    desc: "Reparaciones, hormigón, entrepisos y arreglos menores.",
    img: "/servicios/obra-civil.jpg",
    href: "/servicios#obra-civil-menor",
  },
  {
    id: "senalizacion-vial",
    title: "Demarcación vial",
    desc: "Demarcación y señalización para calles y estacionamientos.",
    img: "/servicios/senalizacion.jpg",
    href: "/servicios#senalizacion-vial",
  },
  {
    id: "herrerias",
    title: "Herrerías",
    desc: "Estructuras metálicas, rejas y trabajos a medida.",
    img: "/servicios/herrerias.jpg",
    href: "/servicios#herrerias",
  },
  {
    id: "innovaciones",
    title: "Innovaciones",
    desc: "Soluciones tecnológicas e integraciones a medida.",
    img: "/servicios/innovaciones.jpg",
    href: "/servicios#innovaciones",
  },
];

export default function Home() {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative">
        <div className="relative h-[70vh] md:h-[80vh] lg:h-[85vh] w-full overflow-hidden">
          {/* Imagen de fondo tomada desde public/bg-index.jpeg */}
          <div
            className="absolute inset-0 bg-top bg-cover"
            style={{ backgroundImage: "url('/bg-index.jpeg')", backgroundPosition: "top center" }}
            aria-hidden="true"
          />

          {/* Degradado L->R que se superpone a la imagen (ajustar color en preferencia) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(46,53,140,0.92) 0%, rgba(46,53,140,0.6) 40%, rgba(46,53,140,0.25) 60%, rgba(0,0,0,0) 100%)",
            }}
            aria-hidden="true"
          />

          {/* Capa extra para legibilidad */}
          <div className="absolute inset-0 bg-black/6" aria-hidden="true" />

          {/* Contenido del hero - centrado */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center px-6 max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-title text-white drop-shadow-md">
                Bienvenidos a BENCOM
              </h1>
              <p className="mt-4 text-lg md:text-xl text-white/90">
                Somos una empresa que nace del conocimiento operativo, en busca de su desarrollo dentro de la Red de Estaciones; basados
                en la seguridad y&nbsp;el&nbsp;compromiso&nbsp;diario.
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <a
                  href="/servicios"
                  className="inline-block bg-white text-[#2e358c] font-medium px-6 py-3 rounded shadow hover:shadow-lg transform hover:-translate-y-0.5 transition"
                >
                  Ver servicios
                </a>
                <a
                  href="https://wa.me/+5491127797320"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#2e358c] text-white font-medium px-6 py-3 rounded shadow hover:shadow-lg transform hover:-translate-y-0.5 transition"
                >
                  Contactanos
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios: carousel (reutilizable) */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold">Nuestros servicios</h3>
            <p className="text-sm text-gray-500 hidden sm:block">Ver todo en la sección servicios</p>
          </div>

          <Carousel items={SERVICIOS} />
        </div>
      </section>

      {/* Aquí podés agregar más secciones debajo del hero */}
      <section className="py-12">{/* ... resto del contenido ... */}</section>
    </Layout>
  );
}
