import { useEffect, useState, useRef } from "react";
import Layout from "./Layout";

export default function ServicePage({
  title,
  description,
  items = [],
  images = [],
  otherServices = [],
}) {
  const [modal, setModal] = useState({ open: false, index: 0, images: [] });
  const [openId, setOpenId] = useState(null);
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 });
  const contentRefs = useRef({});

  /* ================= GALERÍA PRINCIPAL ================= */
  useEffect(() => {
    if (!modal.open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    function onKey(e) {
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowLeft")
        setModal((m) => ({ ...m, index: Math.max(0, m.index - 1) }));
      if (e.key === "ArrowRight")
        setModal((m) => ({
          ...m,
          index: Math.min(m.images.length - 1, m.index + 1),
        }));
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal.open]);

  function openGallery(start = 0) {
    setModal({ open: true, index: start, images });
  }

  function closeGallery() {
    setModal({ open: false, index: 0, images: [] });
  }

  /* ================= LIGHTBOX OTROS SERVICIOS ================= */
  useEffect(() => {
    if (!lightbox.open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e) {
      if (e.key === "Escape") setLightbox({ ...lightbox, open: false });
      if (e.key === "ArrowLeft")
        setLightbox((m) => ({ ...m, index: Math.max(0, m.index - 1) }));
      if (e.key === "ArrowRight")
        setLightbox((m) => ({
          ...m,
          index: Math.min(m.images.length - 1, m.index + 1),
        }));
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev || "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox.open]);

  function toggle(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  function openImageGallery(imagesArr, start = 0) {
    setLightbox({ open: true, images: imagesArr, index: start });
  }

  return (
    <Layout>
      {/* ================= HEADER ================= */}
      <section className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-title">{title}</h1>
        <p className="text-gray-700">{description}</p>

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

        {/* ================= GALERÍA ================= */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => openGallery(i)}
              className="group relative overflow-hidden rounded-md border bg-gray-50"
            >
              <img
                src={src}
                alt={`${title} ${i + 1}`}
                className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </button>
          ))}
        </div>
      </section>

      {/* ================= MODAL PRINCIPAL ================= */}
      {modal.open && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeGallery}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cerrar */}
            <button
              onClick={closeGallery}
              className="absolute top-4 right-4 text-white text-2xl bg-black/40 px-3 py-1 rounded-md hover:bg-black/70 z-50"
            >
              ✕
            </button>

            {/* Flecha izquierda */}
            <button
              onClick={() =>
                setModal((m) => ({ ...m, index: Math.max(0, m.index - 1) }))
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black/40 px-3 py-1 rounded-full hover:bg-black/70 z-50"
            >
              ‹
            </button>

            {/* Imagen */}
            <div className="flex items-center justify-center h-full">
              <img
                src={modal.images[modal.index]}
                alt=""
                className="max-h-[85vh] max-w-full object-contain rounded-md"
              />
            </div>

            {/* Flecha derecha */}
            <button
              onClick={() =>
                setModal((m) => ({
                  ...m,
                  index: Math.min(m.images.length - 1, m.index + 1),
                }))
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black/40 px-3 py-1 rounded-full hover:bg-black/70 z-50"
            >
              ›
            </button>

            {/* Contador */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/60 px-3 py-1 rounded-full">
              {modal.index + 1} / {modal.images.length}
            </div>
          </div>
        </div>
      )}

      {/* ================= OTROS SERVICIOS ================= */}
      {otherServices.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white shadow rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-title">Otros servicios</h2>

            {otherServices.map((s) => {
              const isOpen = openId === s.id;
              return (
                <div key={s.id} className="border rounded-md overflow-hidden">
                  <button
                    onClick={() => toggle(s.id)}
                    className="w-full px-4 py-3 flex justify-between items-center"
                  >
                    <div className="text-left">
                      <div className="font-medium">{s.title}</div>
                      <div className="text-sm text-gray-500">{s.description}</div>
                    </div>
                    <span>{isOpen ? "▲" : "▼"}</span>
                  </button>

                  <div
                    ref={(el) => (contentRefs.current[s.id] = el)}
                    className="overflow-hidden transition-all duration-500"
                    style={{
                      maxHeight: isOpen
                        ? `${contentRefs.current[s.id]?.scrollHeight}px`
                        : "0px",
                    }}
                  >
                    <div className="px-4 pb-4 space-y-4">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {s.list.map((i) => (
                          <li key={i}>• {i}</li>
                        ))}
                      </ul>

                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {s.images.map((img, i) => (
                          <img
                            key={img + i}
                            src={img}
                            onClick={() => openImageGallery(s.images, i)}
                            className="h-28 w-full object-cover cursor-pointer rounded-md"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ================= LIGHTBOX OTROS SERVICIOS ================= */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox({ ...lightbox, open: false })}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox({ ...lightbox, open: false })}
              className="absolute top-4 right-4 text-white text-2xl bg-black/40 px-3 py-1 rounded-md z-50"
            >
              ✕
            </button>

            <button
              onClick={() =>
                setLightbox((m) => ({ ...m, index: Math.max(0, m.index - 1) }))
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black/40 px-3 py-1 rounded-full z-50"
            >
              ‹
            </button>

            <img
              src={lightbox.images[lightbox.index]}
              className="max-h-[85vh] mx-auto object-contain rounded-md"
            />

            <button
              onClick={() =>
                setLightbox((m) => ({
                  ...m,
                  index: Math.min(m.images.length - 1, m.index + 1),
                }))
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black/40 px-3 py-1 rounded-full z-50"
            >
              ›
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/60 px-3 py-1 rounded-full">
              {lightbox.index + 1} / {lightbox.images.length}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
