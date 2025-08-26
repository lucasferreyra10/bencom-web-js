// pages/index.js
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative">
        <div className="relative h-[70vh] md:h-[80vh] lg:h-[85vh] w-full overflow-hidden">
          {/* Imagen de fondo tomada desde public/bg-index.jpeg */}
          <div
            className="absolute inset-0 bg-top bg-cover"
            style={{ backgroundImage: "url('/bg-index.jpeg')" }}
            aria-hidden="true"
          />

          {/* Degradado L->R que se superpone a la imagen (ajustar color en preferencia) */}
          <div
            className="absolute inset-0"
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
              <p className="mt-4 text-lg md:text-xl text-white/90">
                Somos una empresa que nace del conocimiento operativo,
                en busca de su desarrollo dentro de la Red de Estaciones;
                basados en la seguridad y&nbsp;el&nbsp;compromiso&nbsp;diario.
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
                  className="inline-block bg-[#2e358c] text-white font-medium px-6 py-3 rounded shadow hover:shadow-lg transform hover:-translate-y-0.5 transition"
                >
                  Contactanos
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Aquí podés agregar más secciones debajo del hero */}
     /<section className="py-12">{/* ... resto del contenido ... */}</section>
    </Layout>
  );
}
