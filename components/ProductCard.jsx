// components/ProductCard.jsx
import React from "react";
import { useCart } from "./CartProvider";

export default function ProductCard({ product, onOpenGallery }) {
  const { addItem } = useCart();

  // ---- Helpers precio / formato ----
  const IVA = 0.21;
  const multiplier = 1 / (1 + IVA); // 0.826446281...

  function parsePrice(value) {
    if (typeof value === "number" && !Number.isNaN(value)) return value;
    if (typeof value !== "string") return 0;
    let s = value.replace(/[^\d.,-]/g, "").trim(); // quita símbolos tipo $
    if (s === "") return 0;
    if (s.indexOf(",") > -1 && s.indexOf(".") > -1) {
      s = s.replace(/\./g, "").replace(",", ".");
    } else if (s.indexOf(",") > -1 && s.indexOf(".") === -1) {
      s = s.replace(",", ".");
    }
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  }

  function fmtNumber(n) {
    return Number.isFinite(n)
      ? n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : "0,00";
  }

  function fmtCurrency(n) {
    return `$${fmtNumber(n)}`;
  }
  // -----------------------------------

  const originalPrice = parsePrice(product?.price ?? product?.precio ?? 0);
  const netPrice = originalPrice * multiplier;

  return (
    <article className="bg-white border rounded-lg p-4 flex flex-col">
      <button
        type="button"
        onClick={() => onOpenGallery?.(product, 0)}
        className="block overflow-hidden rounded-md mb-3"
        aria-label={`Abrir galería de ${product.title}`}
      >
        <img
          src={(product.images && product.images[0]) || product.image}
          alt={product.title}
          className="w-full aspect-[3/2] object-cover rounded-md"
        />
      </button>

      <h3 className="font-semibold">{product.title}</h3>
      <p
        className="text-sm text-gray-600 mt-1 flex-1"
        dangerouslySetInnerHTML={{ __html: product.description }}
      />

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          {/* Precio original (el que resalta) */}
          <div className="text-lg font-semibold">
            {fmtCurrency(originalPrice)}
          </div>

          {/* Frase con precio sin impuestos todo en la misma línea */}
          <div className="text-xs text-gray-500 ml-2">
            Precio sin impuestos {fmtCurrency(netPrice)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenGallery?.(product, 0)}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            aria-label={`Ver más fotos de ${product.title}`}
          >
            Ver
          </button>
        </div>
      </div>
    </article>
  );
}