// pages/servicios/destapaciones.js
import { useEffect, useState, useRef } from "react";
import Layout from "../../components/Layout";

export default function Destapaciones() {
  // --- Tu contenido original (items + imágenes) ---
  const items = ["Cloacas", "Pluviales", "Cocinas", "Lavaderos"];
  const images = [
    "https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop",
  ];

  const [modal, setModal] = useState({ open: false, index: 0, images: [] });

  useEffect(() => {
    if (!modal.open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") setModal((m) => ({ ...m, open: false }));
      if (e.key === "ArrowLeft")
        setModal((m) => ({ ...m, index: Math.max(0, m.index - 1) }));
      if (e.key === "ArrowRight")
        setModal((m) => ({ ...m, index: Math.min(m.images.length - 1, m.index + 1) }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal.open]);

  const openGallery = (start = 0) => setModal({ open: true, index: start, images });
  const closeGallery = () => setModal({ open: false, index: 0, images: [] });

  // --- Ahora: "Otros servicios" (acordeón igual que en services.js) ---
  const imagePool = [
    "https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1508385082359-f2e6e9f6d3a2?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
  ];

  // Excluimos "destapaciones" para no duplicar su contenido
  const otherServices = [
    {
      id: "obra-civil-menor",
      title: "Obra civil menor",
      description: "Pequeñas obras civiles con calidad garantizada.",
      list: [
        "Consorcios",
        "Restaurantes",
        "Comercios",
        "Industrias",
        "Domicilios",
      ],
      images: [imagePool[0], imagePool[1]],
    },
    {
      id: "demarcacion-vial",
      title: "Demarcación vial",
      description: "Demarcación para todo tipo de proyectos.",
      list: [
        "Sendas",
        "Topes y Estacionamiento",
        "Pintura de Cordones",
        "Arreglos menores",
        "Proyectos",
        "Planeamiento de reformas",
      ],
      images: [imagePool[1], imagePool[4], imagePool[0]],
    },
    {
      id: "pintura-en-altura",
      title: "Pintura en altura",
      description: "Servicios de pintura en altura con profesionales capacitados.",
      list: [
        "Pintura en fachadas",
        "Mantenimiento de estructuras",
        "Aplicación de recubrimientos especiales",
      ],
      images: [imagePool[1], imagePool[4], imagePool[0]],
    },
    {
      id: "herrerias",
      title: "Herrerías",
      description: "Trabajos de herrería a medida: estructuras, rejas y más.",
      list: [
        "Trabajos garantizados",
        "No cobramos por metro",
        "Contamos con factura",
        "Aceptamos transferencias, tarjetas y cuenta corriente",
        "Atención en CABA y AMBA",
      ],
      images: [imagePool[3], imagePool[4]],
    },
    {
      id: "equipos-de-frio",
      title: "Equipos de frío",
      description: "Mantenimiento y reparación de equipos de refrigeración.",
      list: ["Mantención preventiva", "Reparaciones", "Instalaciones"],
      images: [imagePool[3], imagePool[4]],
    },
    {
      id: "proyectos-ideas",
      title: "Proyectos/ Ideas",
      description: "Soluciones innovadoras para optimizar procesos y mantenimiento.",
      list: ["Automatización", "Mejoras en procesos", "Diagnóstico y optimización"],
      images: [imagePool[3], imagePool[4]],
    },
  ];

  // Acordeón global (misma lógica que en servicios.js)
  const [openId, setOpenId] = useState(null);
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 });
  const contentRefs = useRef({});

  useEffect(() => {
    if (!lightbox.open) return;
    function onKey(e) {
      if (e.key === "Escape") setLightbox({ ...lightbox, open: false });
      if (e.key === "ArrowLeft")
        setLightbox((m) => ({ ...m, index: Math.max(0, m.index - 1) }));
      if (e.key === "ArrowRight")
        setLightbox((m) => ({ ...m, index: Math.min(m.images.length - 1, m.index + 1) }));
    }
    window.addEventListener("keydown", onKey);
    // lock scrolling when open
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev || "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox.open]);

  function toggle(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  function openImageGallery(imagesArr, start = 0) {
    setLightbox({ open: true, images: imagesArr, index: start });
  }

  return (
    <Layout>
      <section className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* --- Tu header y descripción --- */}
        <h1 className="text-3xl font-title">Destapaciones</h1>
        <p className="text-gray-700">
          Brindamos un servicio profesional, eficiente y confiable.
        </p>

        {/* --- Lista de items original --- */}
        {items.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
            {items.map((it) => (
              <li key={it} className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 bg-secondary rounded-full mt-2" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        )}

        {/* --- Galería original --- */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => openGallery(i)}
              className="group relative overflow-hidden rounded-md border bg-gray-50"
              aria-label={`Ver imagen ${i + 1}`}
            >
              <img
                src={src}
                alt={`Destapaciones ${i + 1}`}
                className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </section>

      {/* --- Lightbox para la galería principal --- */}
      {modal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={closeGallery}
          role="dialog"
          aria-modal="true"
          aria-label="Visor de imágenes Destapaciones"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeGallery}
              className="absolute top-3 right-3 z-50 bg-white/10 hover:bg-white/20 rounded-md p-2 text-white"
              aria-label="Cerrar"
            >
              ✕
            </button>

            <button
              onClick={() => setModal((m) => ({ ...m, index: Math.max(0, m.index - 1) }))}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-40 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white"
              aria-label="Anterior"
            >
              ‹
            </button>

            <button
              onClick={() => setModal((m) => ({ ...m, index: Math.min(m.images.length - 1, m.index + 1) }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-40 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white"
              aria-label="Siguiente"
            >
              ›
            </button>

            <div className="flex items-center justify-center h-full">
              <img
                src={modal.images[modal.index]}
                alt={`Imagen ${modal.index + 1}`}
                className="max-h-[80vh] w-auto max-w-full rounded-md shadow-lg"
              />
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 px-3 py-1 rounded-md">
              {modal.index + 1} / {modal.images.length}
            </div>
          </div>
        </div>
      )}

      {/* --- Sección: Otros servicios con el acordeón (sin duplicar destapaciones) --- */}
      <section className="space-y-8 px-4 py-8 max-w-5xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-title mb-2">Otros servicios</h2>
          <p className="text-gray-600 mb-6">Otras especialidades que ofrecemos.</p>

          <div className="space-y-4">
            {otherServices.map((s) => {
              const isOpen = openId === s.id;
              return (
                <div key={s.id} className="border rounded-md overflow-hidden">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${s.id}-panel`}
                    onClick={() => toggle(s.id)}
                    className="w-full px-4 py-3 flex items-center justify-between bg-white/5 hover:bg-white/10 transition"
                  >
                    <div className="text-left">
                      <div className="font-medium text-lg">{s.title}</div>
                      <div className="text-sm text-gray-500">{s.description}</div>
                    </div>
                    <div className="text-gray-400 ml-4">{isOpen ? "▲" : "▼"}</div>
                  </button>

                  <div
                    id={`${s.id}-panel`}
                    role="region"
                    aria-labelledby={s.id}
                    ref={(el) => (contentRefs.current[s.id] = el)}
                    className={`px-4 pb-4 transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? "opacity-100" : "opacity-0"}`}
                    style={{
                      maxHeight: isOpen ? `${contentRefs.current[s.id]?.scrollHeight}px` : "0px",
                    }}
                  >
                    <div className="mb-4 pt-4">
                      {s.list && s.list.length > 0 && (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                          {s.list.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="inline-block w-2 h-2 bg-secondary rounded-full mt-2" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {s.images.map((src, i) => (
                        <button
                          key={src + i}
                          onClick={() => openImageGallery(s.images, i)}
                          className="group relative overflow-hidden rounded-md border bg-gray-50"
                          aria-label={`Ver imagen ${i + 1} de ${s.title}`}
                        >
                          <img
                            src={src}
                            alt={`${s.title} foto ${i + 1}`}
                            className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- Lightbox para el acordeón de "Otros servicios" (compartido) --- */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Visor de imágenes"
          onClick={() => setLightbox({ ...lightbox, open: false })}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox({ ...lightbox, open: false })}
              className="absolute top-2 right-2 z-50 bg-white/10 hover:bg-white/20 rounded-md p-2 text-white"
              aria-label="Cerrar"
            >
              ✕
            </button>

            <button
              onClick={() => setLightbox((m) => ({ ...m, index: Math.max(0, m.index - 1) }))}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-40 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white"
              aria-label="Anterior"
            >
              ‹
            </button>

            <button
              onClick={() => setLightbox((m) => ({ ...m, index: Math.min(m.images.length - 1, m.index + 1) }))}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-40 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white"
              aria-label="Siguiente"
            >
              ›
            </button>

            <div className="flex items-center justify-center h-full">
              <img
                src={lightbox.images[lightbox.index]}
                alt={`Imagen ${lightbox.index + 1}`}
                className="max-h-[80vh] w-auto max-w-full rounded-md shadow-lg"
              />
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 px-3 py-1 rounded-md">
              {lightbox.index + 1} / {lightbox.images.length}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
