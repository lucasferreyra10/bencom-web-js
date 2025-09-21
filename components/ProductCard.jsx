// components/ProductCard.jsx
import React from "react";
import { useCart } from "./CartProvider";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <article className="bg-white border rounded-lg p-4 flex flex-col">
      <img src={product.image} alt={product.title} className="w-full h-40 object-cover rounded-md mb-3" />
      <h3 className="font-semibold">{product.title}</h3>
      <p className="text-sm text-gray-600 mt-1 flex-1">{product.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-lg font-semibold">${product.price}</div>
        <button
          onClick={() => addItem(product)}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          Agregar
        </button>
      </div>
    </article>
  );
}
