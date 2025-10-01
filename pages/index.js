// pages/index.js
import Layout from "../components/Layout";
import Carousel from "../components/Carousel";

const SERVICIOS = [
  {
    id: "obra-civil-menor",
    title: "Obra civil menor",
    desc: "Pequeñas obras civiles con calidad garantizada.",
    img: "/servicio-obra.jpg",
    href: "/servicios/obra-civil-menor",
    icon: "/icons/NUEVOS ICONOS BENCOM-01.svg",
  },
  {
    id: "destapaciones",
    title: "Destapaciones",
    desc: "Brindamos un servicio profesional, eficiente y confiable.",
    img: "/bg-index - copia.jpeg",
    href: "/servicios/destapaciones",
    icon: "/icons/NUEVOS ICONOS BENCOM-02.svg",
  },
  {
    id: "demarcacion",
    title: "Demarcación vial",
    desc: "Demarcación para todo tipo de proyectos.",
    img: "/servicio-demarcacion.jpg",
    href: "/servicios/demarcacion-vial",
    icon: "/icons/NUEVOS ICONOS BENCOM-03.svg",
  },
  {
    id: "pintura-en-altura",
    title: "Pintura en altura",
    desc: "Servicios de pintura en altura con profesionales capacitados.",
    img: "/servicio-pintura-altura.jpg",
    href: "/servicios/pintura-en-altura",
    icon: "/icons/NUEVOS ICONOS BENCOM-04.svg",
  },
  {
    id: "herrerias",
    title: "Herrerías",
    desc: "Trabajos de herrería a medida: estructuras, rejas y más.",
    img: "/servicio-herrerias.jpg",
    href: "/servicios/herrerias",
    icon: "/icons/NUEVOS ICONOS BENCOM-05.svg",
  },
  {
    id: "equipos-de-frio",
    title: "Equipos de frío",
    desc: "Mantenimiento y reparación de equipos de refrigeración.",
    img: "/servicio-equipos-frio.jpg",
    href: "/servicios/equipos-de-frio",
    icon: "/icons/NUEVOS ICONOS BENCOM-06.svg",
  },
  {
    id: "proyectos-ideas",
    title: "Proyectos/ Ideas",
    desc: "Soluciones innovadoras para optimizar procesos y mantenimiento.",
    img: "/servicio-Proyectos/ Ideas.jpg",
    href: "/servicios/proyectos-ideas",
    icon: "/icons/NUEVOS ICONOS BENCOM-07.svg",
  },
];

export default function Home() {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative">
        <div
          className="relative h-[70vh] md:h-[80vh] lg:h-[85vh] w-full overflow-hidden"
          aria-hidden="false"
        >
          {/* Imagen de fondo tomada desde public/bg-index.jpeg, posicionada TOP para que en desktop muestre la parte superior */}
          <div
            className="absolute inset-0 bg-top bg-cover bg-no-repeat"
            style={{ backgroundImage: "url('')" }}
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
                  href="/servicios"
                  className="inline-block bg-white text-[#2e358c] font-medium px-6 py-3 rounded shadow hover:shadow-lg transform hover:-translate-y-0.5 transition"
                >
                  Servicios
                </a>

                <a
                  href="https://wa.me/+5491127797320"
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
          <Carousel items={SERVICIOS} />
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
