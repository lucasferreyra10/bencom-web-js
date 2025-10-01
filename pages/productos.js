// pages/productos.js
import React, { useState } from "react";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import ImageLightbox from "../components/ImageLightbox";

/*
  Catálogo de ejemplo. Cada producto tiene un array `images`.
  Reemplazá / cargá desde tu CMS cuando quieras.
*/
const PRODUCTS = [
  {
    id: "p-1",
    title: "Equipo A",
    price: 1200,
    description: "Descripción breve del Equipo A",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    id: "p-2",
    title: "Repuesto B",
    price: 350,
    description: "Repuesto de alta calidad",
    images: [
      "https://images.unsplash.com/photo-1582719478186-0a6f9a3b7e81?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    id: "p-3",
    title: "Kit C",
    price: 780,
    description: "Kit para mantenimiento",
    images: [
      "https://images.unsplash.com/photo-1580910051072-8c3f5b1a1a0d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    id: "p-4",
    title: "Servicio D",
    price: 2200,
    description: "Servicio especializado",
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop",
    ],
  },
];

export default function Productos() {
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 });

  function openGallery(images = [], start = 0) {
    setLightbox({ open: true, images: images || [], index: start });
  }

  function closeGallery() {
    setLightbox((s) => ({ ...s, open: false }));
  }

  function setIndex(i) {
    setLightbox((s) => ({ ...s, index: i }));
  }

  return (
    <Layout>
      <section className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-title">Nuestros productos</h1>
          <p className="text-gray-600">Elegí lo que necesitás y envíanos tu pedido por WhatsApp.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} onOpenGallery={openGallery} />
          ))}
        </div>
      </section>

      <ImageLightbox
        open={lightbox.open}
        images={lightbox.images}
        index={lightbox.index}
        onClose={closeGallery}
        onIndexChange={(i) => setIndex(i)}
      />
    </Layout>
  );
}
