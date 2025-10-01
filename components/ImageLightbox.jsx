// components/ImageLightbox.jsx
import React, { useEffect } from "react";

/**
 * ImageLightbox
 * Props:
 *  - open: boolean
 *  - images: string[] (urls)
 *  - index: number (start index)
 *  - onClose: () => void
 *  - onIndexChange: (newIndex) => void  (optional)
 */
export default function ImageLightbox({ open, images = [], index = 0, onClose, onIndexChange }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowLeft") onIndexChange?.(Math.max(0, index - 1));
      if (e.key === "ArrowRight") onIndexChange?.(Math.min(images.length - 1, index + 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, images.length, onClose, onIndexChange]);

  if (!open) return null;
  const cur = images[index];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Visor de imágenes"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 bg-white/10 hover:bg-white/20 rounded-md p-2 text-white"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <button
          onClick={() => onIndexChange?.(Math.max(0, index - 1))}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-40 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white"
          aria-label="Anterior"
        >
          ‹
        </button>

        <button
          onClick={() => onIndexChange?.(Math.min(images.length - 1, index + 1))}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-40 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white"
          aria-label="Siguiente"
        >
          ›
        </button>

        <div className="flex items-center justify-center h-full">
          <img
            src={cur}
            alt={`Imagen ${index + 1}`}
            className="max-h-[80vh] w-auto max-w-full rounded-md shadow-lg"
          />
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 px-3 py-1 rounded-md">
          {index + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
