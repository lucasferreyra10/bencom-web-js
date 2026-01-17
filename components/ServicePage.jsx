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
  const mainGalleryRef = useRef(null);
  const otherGalleryRef = useRef(null);

  /* ================= GALERÍA PRINCIPAL - KEYBOARD ================= */
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

  /* ================= GALERÍA PRINCIPAL - TOUCH/SWIPE ================= */
  useEffect(() => {
    if (!modal.open || modal.images.length <= 1) return;

    const el = mainGalleryRef.current;
    if (!el) return;

    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isTouch) return;

    let startX = 0;
    let startY = 0;
    let isDragging = false;

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
    };

    const onTouchMove = (e) => {
      if (!isDragging) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = Math.abs(currentX - startX);
      const diffY = Math.abs(currentY - startY);

      if (diffX > diffY) {
        e.preventDefault();
      }
    };

    const onTouchEnd = (e) => {
      if (!isDragging) return;
      isDragging = false;

      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      const threshold = 50;

      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          // Swipe izquierda -> siguiente
          setModal((m) => ({
            ...m,
            index: Math.min(m.images.length - 1, m.index + 1),
          }));
        } else {
          // Swipe derecha -> anterior
          setModal((m) => ({ ...m, index: Math.max(0, m.index - 1) }));
        }
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [modal.open, modal.images.length, modal.index]);

  /* ================= LIGHTBOX OTROS SERVICIOS - KEYBOARD ================= */
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

  /* ================= LIGHTBOX OTROS SERVICIOS - TOUCH/SWIPE ================= */
  useEffect(() => {
    if (!lightbox.open || lightbox.images.length <= 1) return;

    const el = otherGalleryRef.current;
    if (!el) return;

    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isTouch) return;

    let startX = 0;
    let startY = 0;
    let isDragging = false;

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
    };

    const onTouchMove = (e) => {
      if (!isDragging) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = Math.abs(currentX - startX);
      const diffY = Math.abs(currentY - startY);

      if (diffX > diffY) {
        e.preventDefault();
      }
    };

    const onTouchEnd = (e) => {
      if (!isDragging) return;
      isDragging = false;

      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      const threshold = 50;

      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          setLightbox((m) => ({
            ...m,
            index: Math.min(m.images.length - 1, m.index + 1),
          }));
        } else {
          setLightbox((m) => ({ ...m, index: Math.max(0, m.index - 1) }));
        }
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [lightbox.open, lightbox.images.length, lightbox.index]);

  function openGallery(start = 0) {
    setModal({ open: true, index: start, images });
  }

  function closeGallery() {
    setModal({ open: false, index: 0, images: [] });
  }

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
        {images.length > 0 && (
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
        )}
      </section>

      {/* ================= MODAL PRINCIPAL ================= */}
      {modal.open && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeGallery}
        >
          <div
            ref={mainGalleryRef}
            className="relative max-w-4xl w-full max-h-[90vh] touch-pan-y"
            onClick={(e) => e.stopPropagation()}
            style={{
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-y",
            }}
          >
            {/* Cerrar */}
            <button
              onClick={closeGallery}
              className="absolute top-4 right-4 text-white text-2xl bg-black/40 px-3 py-1 rounded-md hover:bg-black/70 z-50"
              aria-label="Cerrar galería"
            >
              ✕
            </button>

            {/* Flecha izquierda */}
            {modal.images.length > 1 && (
              <button
                onClick={() =>
                  setModal((m) => ({ ...m, index: Math.max(0, m.index - 1) }))
                }
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black/40 px-3 py-1 rounded-full hover:bg-black/70 z-50 transition-opacity ${
                  modal.index === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={modal.index === 0}
                aria-label="Imagen anterior"
              >
                ‹
              </button>
            )}

            {/* Imagen */}
            <div className="flex items-center justify-center h-full">
              <img
                src={modal.images[modal.index]}
                alt={`${title} imagen ${modal.index + 1}`}
                className="max-h-[85vh] max-w-full object-contain rounded-md select-none"
                draggable="false"
              />
            </div>

            {/* Flecha derecha */}
            {modal.images.length > 1 && (
              <button
                onClick={() =>
                  setModal((m) => ({
                    ...m,
                    index: Math.min(m.images.length - 1, m.index + 1),
                  }))
                }
                className={`absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black/40 px-3 py-1 rounded-full hover:bg-black/70 z-50 transition-opacity ${
                  modal.index === modal.images.length - 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={modal.index === modal.images.length - 1}
                aria-label="Imagen siguiente"
              >
                ›
              </button>
            )}

            {/* Contador */}
            {modal.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/60 px-3 py-1 rounded-full">
                {modal.index + 1} / {modal.images.length}
              </div>
            )}
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
                    className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition"
                  >
                    <div className="text-left">
                      <div className="font-medium">{s.title}</div>
                      <div className="text-sm text-gray-500">{s.description}</div>
                    </div>
                    <span className="text-gray-400">{isOpen ? "▲" : "▼"}</span>
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
                      {s.list && s.list.length > 0 && (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                          {s.list.map((i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="inline-block w-2 h-2 bg-secondary rounded-full mt-2" />
                              <span>{i}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {s.images && s.images.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {s.images.map((img, i) => (
                            <button
                              key={img + i}
                              onClick={() => openImageGallery(s.images, i)}
                              className="group relative overflow-hidden rounded-md border bg-gray-50"
                            >
                              <img
                                src={img}
                                alt={`${s.title} ${i + 1}`}
                                className="h-28 w-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            </button>
                          ))}
                        </div>
                      )}
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
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox({ ...lightbox, open: false })}
        >
          <div
            ref={otherGalleryRef}
            className="relative max-w-4xl w-full touch-pan-y"
            onClick={(e) => e.stopPropagation()}
            style={{
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-y",
            }}
          >
            {/* Cerrar */}
            <button
              onClick={() => setLightbox({ ...lightbox, open: false })}
              className="absolute top-4 right-4 text-white text-2xl bg-black/40 px-3 py-1 rounded-md hover:bg-black/70 z-50"
              aria-label="Cerrar galería"
            >
              ✕
            </button>

            {/* Flecha izquierda */}
            {lightbox.images.length > 1 && (
              <button
                onClick={() =>
                  setLightbox((m) => ({ ...m, index: Math.max(0, m.index - 1) }))
                }
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black/40 px-3 py-1 rounded-full hover:bg-black/70 z-50 transition-opacity ${
                  lightbox.index === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={lightbox.index === 0}
                aria-label="Imagen anterior"
              >
                ‹
              </button>
            )}

            {/* Imagen */}
            <div className="flex items-center justify-center h-full">
              <img
                src={lightbox.images[lightbox.index]}
                alt={`Imagen ${lightbox.index + 1}`}
                className="max-h-[85vh] mx-auto object-contain rounded-md select-none"
                draggable="false"
              />
            </div>

            {/* Flecha derecha */}
            {lightbox.images.length > 1 && (
              <button
                onClick={() =>
                  setLightbox((m) => ({
                    ...m,
                    index: Math.min(m.images.length - 1, m.index + 1),
                  }))
                }
                className={`absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black/40 px-3 py-1 rounded-full hover:bg-black/70 z-50 transition-opacity ${
                  lightbox.index === lightbox.images.length - 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={lightbox.index === lightbox.images.length - 1}
                aria-label="Imagen siguiente"
              >
                ›
              </button>
            )}

            {/* Contador */}
            {lightbox.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/60 px-3 py-1 rounded-full">
                {lightbox.index + 1} / {lightbox.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}