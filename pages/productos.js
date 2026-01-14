// pages/productos.js
import React, { useState } from "react";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import ProductLightbox from "../components/ProductLightbox";

/*
  Catálogo de ejemplo. Cada producto tiene un array `images`.
  Reemplazá / cargá desde tu CMS cuando quieras.
*/
const PRODUCTS = [
  {
    id: "p-1",
    title: "Chapas identificadoras",
    price: 0.0,
    description: "De <strong>BOCA DE DESCARGA</strong> para combustibles",
    longDescription:
      "Chapas de acero de 10cm x 5cm. Ofrecemos servicio de colocación respetando las medidas de seguridad en E/S.<br><strong>¡HACEMOS ENVIOS AL INTERIOR!</strong><br/><br>A continuación, indicar la cantidad de tanques.<br/>",
    images: ["/products/chapas-identificadoras/img1.jpg"],
    disclaimer:
      "<strong>(*) LUEGO DE HACER TU PEDIDO</strong> te pedimos la descripción de cada uno detallando: número de tanque, producto y cantidad de litros correspondiente</div>",
  },
  {
    id: "p-2",
    title: "Chapas identificadoras",
    price: 0.0,
    description: "De <strong>RECUPERADORAS</strong> para combustibles",
    longDescription:
      "Chapas de acero de 10cm x 5cm. Ofrecemos servicio de colocación respetando las medidas de seguridad en E/S. <br><strong>¡HACEMOS ENVIOS AL INTERIOR!</strong><br/><br>A continuación, indicar modelo y cantidades.<br/>",
    images: [
      "/products/chapas-identificadoras/img2.jpg",
      "/products/chapas-identificadoras/img3.jpg",
    ],
  },
  {
    id: "p-3",
    title: "Chapas identificadoras",
    price: 0.0,
    description: "De <strong>PUESTA A TIERRA</strong> para combustibles",
    longDescription:
      "Chapas de acero de 10cm x 5cm. Ofrecemos servicio de colocación respetando las medidas de seguridad en E/S. <br><strong>¡HACEMOS ENVIOS AL INTERIOR!</strong><br/><br>A continuación, indicar cantidades.<br/>",
    images: ["/products/chapas-identificadoras/img4.jpg"],
  },
  {
    id: "p-4",
    title: "Pico prolongador",
    price: 0.0,
    description: "Para carga de combustible de 1 metro",
    longDescription: `
                      <strong>Modelo 11A</strong>: adecuado para pico de vehículos livianos.
                      <strong>Modelo 11B</strong>: adecuado para picos de alto caudal.<br>
                      Materiales aptos para uso en áreas clasificadas. Antichispas.
                      Empuñadura y orejas de goma para su práctica manipulación.
                      Caño de aluminio. Drenaje con corte a 45°.
                      Medida: 1 metro.
                      <strong>¡HACEMOS ENVIOS AL INTERIOR!</strong><br>
                      A continuación, indicar cantidades.
                      `.trim(),
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    id: "p-5",
    title: "Pico prolongador",
    price: 0.0,
    description: "Modelo 11B, medida especial para batanes",
    longDescription: `
                      <strong>Modelo 11B</strong>: adecuado para picos de alto caudal.<br>
                      Materiales aptos para uso en áreas clasificadas. Antichispas.
                      Empuñadura y orejas de goma para su práctica manipulación.
                      Caño de aluminio. Drenaje con corte a 45°.
                      Medida: 1,5 metros.
                      <strong>¡HACEMOS ENVIOS AL INTERIOR!</strong><br>
                      A continuación, indicar cantidades.
                      `.trim(),
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  {
    id: "p-6",
    title: "Guantes de nitrilo negros",
    price: 0.0,
    description: "Para sustancias, por talle",
    longDescription: `
                      Guantes de examinación de Nitrilo.
                      Marca: <strong>POWERCREST</strong>.<br>
                      1 caja de 1.000 unidades por talle (10 cajas x 100 unidades)<br>
                      Elegir talles y cantidades.
                      `.trim(),
    images: [
      "/products/guantes-de-nitrilo/img1.jpg",
      "/products/guantes-de-nitrilo/img2.jpg",
      "/products/guantes-de-nitrilo/img3.jpg",
    ],
  },
  {
    id: "p-7",
    title: "Repelente de insectos",
    price: 0.0,
    description: "Escudo",
    longDescription:
      "Repelente de insectos en aerosol marca <strong>ESCUDO</strong>.<br/>Presentación: 130g.<br/>Ideal para uso personal y ambiental.<br/>A continuación, indicar cantidades.<br/>",
    images: ["/products/repelentes/img1.jpg", "/products/repelentes/img2.jpg"],
  },
  {
    id: "p-8",
    title: "Mata moscas y mosquitos",
    price: 0.0,
    description: "Escudo",
    longDescription:
      "Mata moscas y mosquitos en aerosol marca <strong>ESCUDO</strong>.<br/>Presentación: 220g.<br/>Ideal para uso personal y ambiental.<br/>A continuación, indicar cantidades.<br/>",
    images: [
      "/products/insectisidas/img1.jpg",
      "/products/insectisidas/img2.jpg",
    ],
  },
  {
    id: "p-9",
    title: "Aromatizante de ambientes",
    price: 0.0,
    description: "Smell Fresh",
    longDescription:
      "Aromatizante de ambientes en aerosol marca <strong>SMELL FRESH</strong>.<br/>Presentación: 178g.<br/>Ideal para uso personal y ambiental.<br/>A continuación, indicar cantidades.<br/>",
    images: ["/products/aromatizante-de-ambientes/img1.jpg"],
  },
];

export default function Productos() {
  // lightbox ahora guarda el product completo además de index
  const [lightbox, setLightbox] = useState({
    open: false,
    product: null,
    index: 0,
  });

  // abrir la galería para un producto concreto (ProductCard llamará con product, 0)
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
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} onOpenGallery={openGallery} />
          ))}
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
