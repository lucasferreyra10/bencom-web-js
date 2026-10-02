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
import { supabasePublic } from '../lib/supabase/public';

export async function getServerSideProps() {
  try {
    const { data: rawProducts, error } = await supabasePublic
      .from('products')
      .select('*')
      .or('is_hidden.eq.false,is_hidden.is.null')
      .order('order_index', { ascending: true });

    if (error) {
      console.error("Error fetching products from Supabase:", error);
      return { props: { products: [] } };
    }

    const mappedProducts = (rawProducts || []).map(p => {
      // Reconstruir variantes desde las columnas separadas
      let variants = [];
      if (p.variantes_ids && p.variantes_labels) {
        // Soporta tanto comas como punto y coma como separadores
        const ids = p.variantes_ids.split(/[,;]/).map(s => s.trim()).filter(Boolean);
        const labels = p.variantes_labels.split(/[,;]/).map(s => s.trim()).filter(Boolean);
        const stockArr = Array.isArray(p.variantes_stock) 
          ? p.variantes_stock 
          : [];
        
        // Iteramos hasta el mínimo entre ids y labels
        const limit = Math.min(ids.length, labels.length);
        for (let i = 0; i < limit; i++) {
          variants.push({
            id: ids[i],
            label: labels[i],
            // Si no hay stock definido para esta variante, queda null (infinito)
            stock: stockArr[i] !== undefined ? stockArr[i] : null
          });
        }
      }

      return {
        ...p,
        title: p.titulo || p.title || '',
        description: p.descripcion || p.description || '',
        longDescription: p.descripcion_larga || p.longDescription || '',
        images: p.imagenes ? p.imagenes.split(/[,;]/).map(s => s.trim()).filter(Boolean) : (p.images || []),
        image: p.imagenes ? p.imagenes.split(/[,;]/)[0].trim() : (p.image || ''),
        variants: variants.length > 0 ? variants : (p.variants || null)
      }
    });

    return {
      props: {
        products: mappedProducts,
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