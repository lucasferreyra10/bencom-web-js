// pages/index.js
import Layout from "../components/Layout";
import Carousel from "../components/Carousel";
import { waLink } from "../lib/wa";
import { supabasePublic } from "../lib/supabase/public";

import Head from "next/head";

const ICON_MAPPING = {
  "obra-civil-menor": "/icons/NUEVOS ICONOS BENCOM-01.svg",
  "destapaciones": "/icons/NUEVOS ICONOS BENCOM-02.svg",
  "demarcacion-vial": "/icons/NUEVOS ICONOS BENCOM-03.svg",
  "pintura-en-altura": "/icons/NUEVOS ICONOS BENCOM-04.svg",
  "herrerias": "/icons/NUEVOS ICONOS BENCOM-05.svg",
  "equipos-de-frio": "/icons/NUEVOS ICONOS BENCOM-06.svg",
  "proyectos-ideas": "/icons/NUEVOS ICONOS BENCOM-07.svg",
};

const IMG_MAPPING = {
  "obra-civil-menor": "/covers/obra-civil-menor.jpeg",
  "destapaciones": "/covers/destapaciones.jpeg",
  "demarcacion-vial": "/covers/demarcacion.jpeg",
  "pintura-en-altura": "/covers/pintura-en-altura.jpeg",
  "herrerias": "/covers/herrerias.jpeg",
  "equipos-de-frio": "/covers/equipos-de-frio.jpeg",
  "proyectos-ideas": "/covers/proyectos-ideas.jpeg",
};

export async function getServerSideProps() {
  const { data: services, error } = await supabasePublic
    .from("services")
    .select("*")
    .or("is_hidden.eq.false,is_hidden.is.null")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching services", error);
    return { props: { servicesData: [] } };
  }

  const servicesData = (services || []).map((s) => {
    let shortDesc = s.description || "";
    const dotIndex = shortDesc.indexOf(".");
    if (dotIndex !== -1) {
      shortDesc = shortDesc.substring(0, dotIndex + 1);
    }

    return {
      id: s.slug,
      title: s.title,
      desc: shortDesc,
      img: IMG_MAPPING[s.slug] || (s.images && s.images.length > 0 ? s.images[0] : null),
      href: `/servicios/${s.slug}`,
      icon: ICON_MAPPING[s.slug] || null,
    };
  });

  return {
    props: {
      servicesData,
    },
  };
}

export default function Home({ servicesData = [] }) {
  return (
    <Layout>
      <Head>
        <title>BENCOM S.R.L | Mantenimiento de Estaciones de Servicio y Obras Civiles en AMBA</title>
        <meta name="description" content="En BENCOM S.R.L brindamos soluciones integrales de mantenimiento de estaciones de servicio, obras civiles, demarcación vial, pintura en altura, herrerías, equipos de frío y destapaciones en CABA y Gran Buenos Aires." />
        <meta name="keywords" content="bencom, bencom srl, mantenimiento de estaciones de servicio, obra civil menor, destapaciones, demarcación vial, pintura en altura, herrerías, equipos de frío, AMBA, mantenimiento integral" />
        <meta property="og:title" content="BENCOM S.R.L | Mantenimiento de Estaciones de Servicio" />
        <meta property="og:description" content="Especialistas en mantenimiento integral y soluciones operativas para empresas y estaciones de servicio en CABA y Gran Buenos Aires." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.bencom.com.ar/" />
      </Head>
      {/* HERO */}
      <section className="relative">
        <div
          className="relative h-[70vh] md:h-[80vh] lg:h-[85vh] w-full overflow-hidden"
          aria-hidden="false"
        >
          {/* Imagen de fondo tomada desde public/bg-index.jpeg, posicionada TOP para que en desktop muestre la parte superior */}
          <div
            className="absolute inset-0 bg-top bg-cover bg-no-repeat"
            style={{ backgroundImage: "url('/covers/probar_portada_1.png')" }}
            aria-hidden="true"
          />

          {/* Degradado L->R superpuesto */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(46,53,140,0.92) 0%, rgba(46,53,140,0.6) 40%, rgba(0,0,0,0) 100%)",
            }}
            aria-hidden="true"
          />

          {/* Capa extra para legibilidad */}
          <div className="absolute inset-0 bg-black/6" aria-hidden="true" />

          {/* Contenido del hero - centrado */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center px-6 max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-title text-white drop-shadow-md">
                Bienvenidos a BENCOM
              </h1>

              <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                Somos una empresa de mantenimiento que nace del conocimiento
                operativo; tenemos la fortaleza de pensar de una manera integral
                generando aportes a las necesidades de nuestros clientes.
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <a
                  href="/productos"
                  className="inline-block bg-white text-[#2e358c] font-medium px-6 py-3 rounded shadow hover:shadow-lg transform hover:-translate-y-0.5 transition"
                >
                  Productos
                </a>

                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#2e358c] text-white font-medium px-6 py-3 rounded shadow hover:shadow-lg transform hover:-translate-y-0.5 transition"
                >
                  Contactanos
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: Carrusel / Servicios */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-primary mb-6">
            Nuestros servicios
          </h2>

          {/* Carousel: ELIMINÉ minGridBreakpoint para que NUNCA se convierta en grid */}
          <Carousel items={servicesData} />
        </div>
      </section>

      {/* ---------- Feature grid: 4 items (2 cols on mobile, 4 cols on desktop) ---------- */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Item 1 */}
          <article className="bg-[#DFDFDF] rounded-lg p-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary/10">
              {/* icon: NUEVOS ICONOS BENCOM-08.svg */}
              <img
                src="/icons/NUEVOS ICONOS BENCOM-08.svg"
                alt="Trabajos en AMBA"
                className="w-7 h-7 md:w-8 md:h-8"
              />
            </div>

            <h3 className="text-lg font-semibold text-primary">
              Trabajos en AMBA
            </h3>
            <p className="text-sm text-gray-600">
              Realizamos trabajos en CABA y Gran Buenos Aires.
            </p>
          </article>
          {/* Item 2 */}
          <article className="bg-[#DFDFDF] rounded-lg p-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary/10">
              {/* icon: NUEVOS ICONOS BENCOM-09.svg */}
              <img
                src="/icons/NUEVOS ICONOS BENCOM-09.svg"
                alt="Servicio profesional"
                className="w-7 h-7 md:w-8 md:h-8"
              />
            </div>

            <h3 className="text-lg font-semibold text-primary">
              Servicio profesional
            </h3>
            <p className="text-sm text-gray-600">
              Técnicos capacitados y tiempos de respuesta ágiles.
            </p>
          </article>

          {/* Item 3 */}
          <article className="bg-[#DFDFDF] rounded-lg p-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary/10">
              {/* icon: NUEVOS ICONOS BENCOM-10.svg */}
              <img
                src="/icons/NUEVOS ICONOS BENCOM-10.svg"
                alt="Realizamos factura"
                className="w-7 h-7 md:w-8 md:h-8"
              />
            </div>

            <h3 className="text-lg font-semibold text-primary">
              Realizamos factura
            </h3>
            <p className="text-sm text-gray-600">
              Facturamos nuestros servicios con factura A.
            </p>
          </article>

          {/* Item 4 */}
          <article className="bg-[#DFDFDF] rounded-lg p-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary/10">
              {/* icon: NUEVOS ICONOS BENCOM-11.svg */}
              <img
                src="/icons/NUEVOS ICONOS BENCOM-11.svg"
                alt="Medios de pago"
                className="w-7 h-7 md:w-8 md:h-8"
              />
            </div>

            <h3 className="text-lg font-semibold text-primary">
              Medios de pago
            </h3>
            <p className="text-sm text-gray-600">
              Nos adaptamos a la necesidad de cada cliente/empresa.
            </p>
          </article>
        </div>
      </section>
    </Layout>
  );
}
