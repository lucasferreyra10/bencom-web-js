// components/ProductCard.jsx
import React from "react";
import { useCart } from "./CartProvider";

export default function ProductCard({ product, onOpenGallery }) {
  const { addItem } = useCart();

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
          className="w-full h-40 object-cover rounded-md"
        />
      </button>

      <h3 className="font-semibold">{product.title}</h3>
      <p
        className="text-sm text-gray-600 mt-1 flex-1"
        dangerouslySetInnerHTML={{ __html: product.description }}
      />

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <div className="text-lg font-semibold">${product.price}</div>
          <div className="text-xs text-gray-500">Precio sin IVA</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => addItem(product)}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Agregar
          </button>
          <button
            onClick={() => onOpenGallery?.(product, 0)}
            className="px-2 py-1 border rounded text-sm"
            aria-label={`Ver más fotos de ${product.title}`}
          >
            Ver
          </button>
        </div>
      </div>
    </article>
  );
}
