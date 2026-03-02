// components/ProductLightbox.jsx
import React, { useEffect, useState, useRef } from "react";
import { useCart } from "./CartProvider";

/**
 * ProductLightbox
 * - open: boolean
 * - product: object { id, title, description, longDescription, price, images: [], disclaimer, variants: [] }
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

  const [qty, setQty] = useState(0); // Cambiado a 0
  const [variantQty, setVariantQty] = useState({});

  const images =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : product?.image
        ? [product.image]
        : [];

  const maxIndex = Math.max(0, images.length - 1);

  const hasVariants = product?.variants && product.variants.length > 0;

  // ---- Funciones y constantes para precio / formato ----
  const IVA = 0.21;
  const multiplier = 1 / (1 + IVA); // 0.826446281...
  const multiplierStr = multiplier.toFixed(9);

  // parseo robusto: acepta number o string con formatos "14.271,00", "14271.00", "$14.271,00", etc.
  function parsePrice(value) {
    if (typeof value === "number" && !Number.isNaN(value)) return value;
    if (typeof value !== "string") return 0;
    let s = value.replace(/[^\d.,-]/g, "").trim(); // quita símbolos tipo $
    if (s === "") return 0;
    // Si tiene coma y punto -> asumimos "14.271,00" => quitar puntos y cambiar coma por punto
    if (s.indexOf(",") > -1 && s.indexOf(".") > -1) {
      s = s.replace(/\./g, "").replace(",", ".");
    } else if (s.indexOf(",") > -1 && s.indexOf(".") === -1) {
      // "14271,00" -> "14271.00"
      s = s.replace(",", ".");
    }
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  }

  // Formateo estilo Argentina: separador de miles ".", decimales ","
  function fmtNumber(n) {
    return Number.isFinite(n)
      ? n.toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0,00";
  }
  function fmtCurrency(n) {
    return `$${fmtNumber(n)}`;
  }

  // precio original (viene con impuestos ya incluidos en la hoja de cálculo)
  const originalPrice = parsePrice(product?.price ?? product?.precio ?? 0);
  // precio sin impuestos
  const netPrice = originalPrice * multiplier;
  // -----------------------------------------------------------

  // Bloquear scroll del body
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  // Reset cantidad cuando cambia el producto
  useEffect(() => {
    if (open && product?.id) {
      setQty(0); // Cambiado a 0
      if (hasVariants) {
        const initialQty = {};
        product.variants.forEach((v) => {
          initialQty[v.id] = 0;
        });
        setVariantQty(initialQty);
      }
    }
  }, [product?.id, open, hasVariants]);

  // Keyboard navigation
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

  // Touch/Swipe navigation para imágenes
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

      if (diffX > diffY && diffX > 10) {
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

  if (!open || !product) return null;

  function changeQty(v) {
    const n = Number(v);
    if (Number.isNaN(n)) return;
    setQty(Math.max(0, Math.floor(n))); // Cambiado mínimo a 0
  }

  function changeVariantQty(variantId, v) {
    const n = Number(v);
    if (Number.isNaN(n)) return;
    setVariantQty((prev) => ({
      ...prev,
      [variantId]: Math.max(0, Math.floor(n)),
    }));
  }

  function addToCartKeepOpen() {
    if (hasVariants) {
      product.variants.forEach((variant) => {
        const quantity = variantQty[variant.id] || 0;
        if (quantity > 0) {
          const itemToAdd = {
            ...product,
            id: `${product.id}-${variant.id}`,
            title: `${product.title} - ${variant.label}`,
            variant: variant.label,
            quantity: quantity,
          };
          addItem(itemToAdd);
        }
      });
    } else {
      if (qty > 0) {
        // Solo agregar si qty > 0
        const itemToAdd = { ...product, quantity: qty };
        addItem(itemToAdd);
      }
    }
  }

  const totalVariantItems = hasVariants
    ? Object.values(variantQty).reduce((sum, q) => sum + q, 0)
    : 0;

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
        className="relative w-full max-w-6xl h-[90vh] bg-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close btn */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 bg-white/10 hover:bg-white/20 rounded-md p-2 text-gray"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Content area */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-4 h-full">
          {/* LEFT: imagen con swipe */}
          <div
            ref={imageContainerRef}
            className="relative flex items-center justify-center overflow-hidden bg-transparent rounded-md"
          >
            {cur ? (
              <img
                src={cur}
                alt={`${product.title || "Producto"} imagen ${index + 1}`}
                className="max-h-full w-auto max-w-full rounded-md shadow-lg select-none"
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

          {/* RIGHT: panel con SCROLL VERTICAL */}
          <aside
            className="bg-white rounded-md shadow-lg overflow-y-auto overflow-x-hidden"
            style={{
              maxHeight: "100%",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <div
                className="text-sm text-gray-600 mb-3"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />

              <div className="mb-3">
                {/* Precio sin impuestos TODO JUNTO */}
                <div className="text-sm text-gray-500">
                  Precio sin impuestos {fmtCurrency(netPrice)}
                </div>

                {/* Precio original (el que resalta) */}
                <div className="text-2xl font-bold text-primary mt-1">
                  {fmtCurrency(originalPrice)}
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

              {/* Cantidad - Con variantes o sin variantes */}
              {hasVariants ? (
                // Productos CON VARIANTES (guantes)
                <>
                  <div className="mb-3 space-y-3">
                    {product.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="flex items-center justify-between border rounded p-2"
                      >
                        <span className="text-sm font-medium">
                          {variant.label}
                        </span>
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() =>
                              changeVariantQty(
                                variant.id,
                                Math.max(0, (variantQty[variant.id] || 0) - 1),
                              )
                            }
                            className="px-3 py-1 text-sm"
                            aria-label={`Disminuir ${variant.label}`}
                          >
                            -
                          </button>
                          <input
                            aria-label={`Cantidad ${variant.label}`}
                            className="w-16 text-center px-2 py-1 text-sm"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={String(variantQty[variant.id] || 0)}
                            onChange={(e) =>
                              changeVariantQty(variant.id, e.target.value)
                            }
                          />
                          <button
                            onClick={() =>
                              changeVariantQty(
                                variant.id,
                                (variantQty[variant.id] || 0) + 1,
                              )
                            }
                            className="px-3 py-1 text-sm"
                            aria-label={`Aumentar ${variant.label}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addToCartKeepOpen}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    aria-label={`Agregar ${product.title} al carrito`}
                    disabled={totalVariantItems === 0}
                  >
                    Agregar ({totalVariantItems})
                  </button>
                </>
              ) : (
                // Productos SIN VARIANTES
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => changeQty(Math.max(0, qty - 1))}
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
                    className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    aria-label={`Agregar ${product.title} al carrito`}
                    disabled={qty === 0}
                  >
                    Agregar ({qty})
                  </button>
                </div>
              )}

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
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
