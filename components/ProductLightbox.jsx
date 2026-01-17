// components/ProductLightbox.jsx
import React, { useEffect, useState, useRef } from "react";
import { useCart } from "./CartProvider";

/**
 * ProductLightbox
 * - open: boolean
 * - product: object { id, title, description, longDescription, price, images: [], disclaimer }
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
  const imageContainerRef = useRef(null);
  
  // TODOS LOS HOOKS DEBEN IR ANTES DE CUALQUIER RETURN CONDICIONAL
  const [qty, setQty] = useState(1);

  const images =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : product?.image
      ? [product.image]
      : [];

  const maxIndex = Math.max(0, images.length - 1);

  // Reset cantidad cuando cambia el producto
  useEffect(() => {
    if (open && product?.id) {
      setQty(1);
    }
  }, [product?.id, open]);

  // keyboard navigation
  useEffect(() => {
    if (!open) return;
    
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowLeft") onIndexChange?.(Math.max(0, index - 1));
      if (e.key === "ArrowRight")
        onIndexChange?.(Math.min(maxIndex, index + 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, maxIndex, onClose, onIndexChange]);

  // TOUCH/SWIPE navigation
  useEffect(() => {
    if (!open || images.length <= 1) return;
    
    const el = imageContainerRef.current;
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
          onIndexChange?.(Math.min(maxIndex, index + 1));
        } else {
          onIndexChange?.(Math.max(0, index - 1));
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
  }, [open, images.length, index, maxIndex, onIndexChange]);

  // AHORA SÍ PODEMOS HACER EL EARLY RETURN
  if (!open || !product) return null;

  function changeQty(v) {
    const n = Number(v);
    if (Number.isNaN(n)) return;
    setQty(Math.max(1, Math.floor(n)));
  }

  function addToCartKeepOpen() {
    const itemToAdd = { ...product, quantity: qty };
    addItem(itemToAdd);
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
        {/* Close btn */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 bg-white/10 hover:bg-white/20 rounded-md p-2 text-white"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Content area */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-4 items-start">
          {/* LEFT: imagen con swipe */}
          <div
            ref={imageContainerRef}
            className="relative flex items-center justify-center max-h-[80vh] overflow-hidden bg-transparent rounded-md touch-pan-y"
            style={{
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-y",
            }}
          >
            {cur ? (
              <img
                src={cur}
                alt={`${product.title || "Producto"} imagen ${index + 1}`}
                className="max-h-[80vh] w-auto max-w-full rounded-md shadow-lg select-none"
                loading="lazy"
                draggable="false"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-500 rounded-md">
                Sin imagen
              </div>
            )}

            {/* Flechas */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => onIndexChange?.(Math.max(0, index - 1))}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white transition-opacity ${
                    index === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  aria-label="Anterior"
                  disabled={index === 0}
                >
                  ‹
                </button>

                <button
                  onClick={() => onIndexChange?.(Math.min(maxIndex, index + 1))}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white transition-opacity ${
                    index === maxIndex ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  aria-label="Siguiente"
                  disabled={index === maxIndex}
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* RIGHT: panel */}
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
              className="mb-4 text-sm text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  product.longDescription ||
                  product.description ||
                  "Sin descripción adicional.",
              }}
            />

            {/* Cantidad + Agregar */}
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

            {/* Disclaimer */}
            {product.disclaimer && (
              <div
                className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.disclaimer }}
              />
            )}

            {/* Indicador */}
            {images.length > 1 && (
              <div className="mt-4 text-sm text-gray-500">
                {index + 1} / {images.length}
              </div>
            )}

            {/* Miniaturas */}
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