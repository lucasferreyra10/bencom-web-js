// pages/index.js
import Layout from "../components/Layout";
import Carousel from "../components/Carousel";

const SERVICIOS = [
  {
    id: "obra-civil-menor",
    title: "Obra civil menor",
    desc: "Pequeñas obras civiles con seguridad y calidad garantizada.",
    img: "/servicio-obra.jpg",
    href: "/servicios/obra-civil-menor",
    icon: "/icons/obra-civil-menor.png",
  },
  {
    id: "destapaciones",
    title: "Destapaciones",
    desc: "Cloacas, pluviales, cocinas y lavaderos — atención a consorcios, restaurantes, comercios, industrias y domicilios.",
    img: "/bg-index - copia.jpeg",
    href: "/servicios/destapaciones",
    icon: "/icons/destapaciones.svg",
  },
  {
    id: "demarcacion",
    title: "Demarcación vial",
    desc: "Demarcación vial profesional para todo tipo de proyectos.",
    img: "/servicio-demarcacion.jpg",
    href: "/servicios/demarcacion-vial",
    icon: "/icons/demarcacion-vial.png",
  },
  {
    id: "pintura-en-altura",
    title: "Pintura en altura",
    desc: "Servicios de pintura en altura con profesionales capacitados.",
    img: "/servicio-pintura-altura.jpg",
    href: "/servicios/pintura-en-altura",
    icon: "/icons/pintura-en-altura.png",
  },
  {
    id: "herrerias",
    title: "Herrerías",
    desc: "Trabajos de herrería a medida: estructuras, rejas y más.",
    img: "/servicio-herrerias.jpg",
    href: "/servicios/herrerias",
    icon: "/icons/herrerias.png",
  },
  {
    id: "equipos-de-frio",
    title: "Equipos de frío",
    desc: "Mantenimiento y reparación de equipos de refrigeración.",
    img: "/servicio-equipos-frio.jpg",
    href: "/servicios/equipos-de-frio",
    icon: "/icons/equipos-de-frio.png",
  },
  {
    id: "innovaciones",
    title: "Innovaciones",
    desc: "Soluciones innovadoras para optimizar procesos y mantenimiento.",
    img: "/servicio-innovaciones.jpg",
    href: "/servicios/innovaciones",
    icon: "/icons/innovaciones.png",
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
                Somos una empresa de mantenimiento que nace del conocimiento operativo; 
                tenemos la fortaleza de pensar de una manera integral generando aportes 
                a las necesidades de nuestros clientes.
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
              {/* icon: location pin */}
              <svg
                className="w-7 h-7 md:w-8 md:h-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 21s8-5.5 8-11a8 8 0 1 0-16 0c0 5.5 8 11 8 11z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-primary">
              Trabajos en AMBA
            </h3>
            <p className="text-sm text-gray-600">
              Cobertura en CABA y Gran Buenos Aires.
            </p>
          </article>

          {/* Item 2 */}
          <article className="bg-[#DFDFDF] rounded-lg p-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary/10">
              {/* icon: shield / guarantee */}
              <svg
                className="w-7 h-7 md:w-8 md:h-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M12 2l7 3v5c0 5-3.5 9.8-7 12-3.5-2.2-7-7-7-12V5l7-3z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
              {/* icon: cash */}
              <svg
                className="w-7 h-7 md:w-8 md:h-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <rect
                  x="2"
                  y="7"
                  width="20"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M7 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
              {/* icon: card / cuenta corriente */}
              <svg
                className="w-7 h-7 md:w-8 md:h-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <rect
                  x="2"
                  y="5"
                  width="20"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M2 10h20"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <rect
                  x="6"
                  y="13"
                  width="6"
                  height="2"
                  rx="1"
                  fill="currentColor"
                  opacity="0.15"
                />
              </svg>
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
