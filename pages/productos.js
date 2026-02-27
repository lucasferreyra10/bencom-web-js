// pages/productos.js
import React, { useState } from "react";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import ProductLightbox from "../components/ProductLightbox";

/**
 * Ahora traemos los productos desde /api/products (SSR).
 * getServerSideProps construye la base URL desde la request para que
 * funcione tanto en desarrollo (localhost) como en producción.
 */
export async function getServerSideProps(context) {
  try {
    // Construir baseUrl a partir de la request (funciona local y en deploy)
    const req = context.req;
    const protocol = req.headers["x-forwarded-proto"] || (req.connection && req.connection.encrypted ? "https" : "http");
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/products`);
    if (!res.ok) {
      console.error("Error fetching /api/products:", res.status, await res.text());
      return { props: { products: [] } };
    }

    const products = await res.json();
    // Asegurarnos de devolver un array
    return {
      props: {
        products: Array.isArray(products) ? products : [],
      },
    };
  } catch (error) {
    console.error("getServerSideProps error:", error);
    return {
      props: {
        products: [],
      },
    };
  }
}

export default function Productos({ products = [] }) {
  // lightbox ahora guarda el product completo además de index
  const [lightbox, setLightbox] = useState({
    open: false,
    product: null,
    index: 0,
  });

  // abrir la galería para un producto concreto (ProductCard llamará con product, startIndex)
  function openGallery(product, start = 0) {
    setLightbox({ open: true, product, index: start });
  }

  function closeGallery() {
    setLightbox({ open: false, product: null, index: 0 });
  }

  function setIndex(i) {
    setLightbox((s) => ({ ...s, index: i }));
  }

  return (
    <Layout>
      <section className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-title">Nuestros productos</h1>
          <p className="text-gray-600">
            Elegí lo que necesitás y envíanos tu pedido por WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <p className="text-gray-500">No hay productos disponibles.</p>
          ) : (
            products.map((p) => (
              <ProductCard key={p.id} product={p} onOpenGallery={openGallery} />
            ))
          )}
        </div>
      </section>

      <ProductLightbox
        open={Boolean(lightbox.open)}
        product={lightbox.product}
        index={lightbox.index}
        onClose={closeGallery}
        onIndexChange={(i) => setIndex(i)}
      />
    </Layout>
  );
}