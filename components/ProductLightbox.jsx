// components/ProductLightbox.jsx
import React, { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

/**
 * ProductLightbox
 * - open: boolean
 * - product: object { id, title, description, longDescription, price, images: [] }
 * - index: number
 * - onClose: () => void
 * - onIndexChange: (newIndex) => void
 */
export default function ProductLightbox({
  open,
  product = null,
  index = 0,
  onClose,
  onIndexChange,
}) {
  const { addItem } = useCart();

  if (!open || !product) return null;

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  const maxIndex = Math.max(0, images.length - 1);

  // cantidad local
  const [qty, setQty] = useState(1);
  useEffect(() => setQty(1), [product?.id, open]);

  // keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowLeft") onIndexChange?.(Math.max(0, index - 1));
      if (e.key === "ArrowRight")
        onIndexChange?.(Math.min(maxIndex, index + 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, maxIndex, onClose, onIndexChange]);

  function changeQty(v) {
    const n = Number(v);
    if (Number.isNaN(n)) return;
    setQty(Math.max(1, Math.floor(n)));
  }

  // NEW: agrega al carrito PERO NO CIERRA la lightbox
  function addToCartKeepOpen() {
    const itemToAdd = { ...product, quantity: qty };
    addItem(itemToAdd);
    // <-- no onClose() here, dejamos la lightbox abierta
  }

  const cur = images[index] ?? "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de ${product.title || "producto"}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[90vh] bg-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close btn (encima de todo) */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 bg-white/10 hover:bg-white/20 rounded-md p-2 text-white"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Content area: imagen (izq) + panel derecho */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-4 items-start">
          {/* LEFT: imagen con flechas dentro de este contenedor (así NO tapan el panel) */}
          <div className="relative flex items-center justify-center max-h-[80vh] overflow-hidden bg-transparent rounded-md">
            {cur ? (
              <img
                src={cur}
                alt={`${product.title || "Producto"} imagen ${index + 1}`}
                className="max-h-[80vh] w-auto max-w-full rounded-md shadow-lg"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-500 rounded-md">
                Sin imagen
              </div>
            )}

            {/* Flechas dentro del contenedor de la imagen */}
            <button
              onClick={() => onIndexChange?.(Math.max(0, index - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white"
              aria-label="Anterior"
            >
              ‹
            </button>

            <button
              onClick={() => onIndexChange?.(Math.min(maxIndex, index + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white"
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>

          {/* RIGHT: panel con detalle (poner z mayor para garantizar que esté por encima si hubiese solapamientos) */}
          <aside className="relative z-40 bg-white rounded-md shadow-lg p-4 text-gray-900 overflow-auto max-h-[80vh]">
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <div
              className="text-sm text-gray-600 mb-3"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            <div className="mb-3">
              <div className="text-xs text-gray-500">Precio sin IVA</div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-primary">
                  ${Number(product.price || 0).toFixed(2)}
                </div>
              </div>
            </div>
            <div
              className="mb-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html:
                  product.longDescription ||
                  product.description ||
                  "Sin descripción adicional.",
              }}
            />

            {/* Cantidad + Agregar (NO cierra la lightbox) */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded">
                <button
                  onClick={() => changeQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 text-sm"
                  aria-label="Disminuir cantidad"
                >
                  -
                </button>
                <input
                  aria-label="Cantidad"
                  className="w-16 text-center px-2 py-2 text-sm"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={String(qty)}
                  onChange={(e) => changeQty(e.target.value)}
                />
                <button
                  onClick={() => changeQty(qty + 1)}
                  className="px-3 py-2 text-sm"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>

              <button
                onClick={addToCartKeepOpen}
                className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                aria-label={`Agregar ${product.title} al carrito`}
              >
                Agregar ({qty})
              </button>
            </div>

            {/* NUEVO: Disclaimer condicional */}
            {product.disclaimer && (
              <div
                className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.disclaimer }}
              />
            )}

            {/* Indicador + miniaturas */}
            <div className="mt-4 text-sm text-gray-500">
              {index + 1} / {Math.max(1, images.length)}
            </div>

            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => onIndexChange?.(i)}
                    className={`border rounded overflow-hidden ${
                      i === index ? "ring-2 ring-primary" : ""
                    }`}
                    aria-label={`Ver imagen ${i + 1}`}
                  >
                    <img
                      src={src}
                      alt={`Miniatura ${i + 1}`}
                      className="w-full h-16 object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
