// pages/index.js
import Layout from "../components/Layout";
import Carousel from "../components/Carousel";

const SERVICIOS = [
  {
    id: "destapaciones",
    title: "Destapaciones",
    desc: "Cloacas, pluviales, cocinas y lavaderos — atención a consorcios, restaurantes, comercios, industrias y domicilios.",
    img: "/servicio-destapaciones.jpg", // reemplaza por tu imagen en /public
    href: "/servicios#destapaciones",
  },
  {
    id: "obra-civil-menor",
    title: "Obra civil menor",
    desc: "Pequeñas obras civiles con seguridad y calidad garantizada.",
    img: "/servicio-obra.jpg",
    href: "/servicios#obra-civil-menor",
  },
  {
    id: "senalizacion",
    title: "Demarcación vial",
    desc: "Demarcación vial profesional para todo tipo de proyectos.",
    img: "/servicio-senalizacion.jpg",
    href: "/servicios#senalizacion-vial",
  },
  {
    id: "herrerias",
    title: "Herrerías",
    desc: "Trabajos de herrería a medida: estructuras, rejas y más.",
    img: "/servicio-herrerias.jpg",
    href: "/servicios#herrerias",
  },
  {
    id: "innovaciones",
    title: "Innovaciones",
    desc: "Soluciones innovadoras para optimizar procesos y mantenimiento.",
    img: "/servicio-innovaciones.jpg",
    href: "/servicios#innovaciones",
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
            style={{ backgroundImage: "url('/bg-index.jpeg')" }}
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
                Somos una empresa que nace del conocimiento operativo, en busca de su
                desarrollo dentro de la Red de Estaciones; basados en la seguridad y el
                compromiso diario.
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <a
                  href="/servicios"
                  className="inline-block bg-white text-[#2e358c] font-medium px-6 py-3 rounded shadow hover:shadow-lg transform hover:-translate-y-0.5 transition"
                >
                  Ver servicios
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
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-primary mb-6">Nuestros servicios</h2>

          {/* Carousel: el componente que pegaste en components/Carousel.js */}
          {/* minGridBreakpoint: si quieres que en pantallas >= 1024 se muestre en grid en vez de carrusel, setear 1024 */}
          <Carousel items={SERVICIOS} minGridBreakpoint={1024} />
        </div>
      </section>

      {/* Aquí puedes agregar más secciones */}
      <section className="py-12" />
    </Layout>
  );
}
