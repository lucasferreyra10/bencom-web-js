// pages/index.js
import Layout from "../components/Layout";
import Carousel from "../components/Carousel";
import { waLink } from "../lib/wa";

export async function getServerSideProps(context) {
  try {
    const req = context.req;
    const protocol =
      req.headers["x-forwarded-proto"] ||
      (req.connection && req.connection.encrypted ? "https" : "http");
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/products`);
    if (!res.ok) {
      return { props: { products: [] } };
    }

    const products = await res.json();
    return {
      props: {
        products: Array.isArray(products) ? products : [],
      },
    };
  } catch (error) {
    console.error("getServerSideProps error:", error);
    return { props: { products: [] } };
  }
}

function stripHtml(html) {
  if (!html) return "";
  return String(html).replace(/<[^>]*>/g, "").trim();
}

export default function Home({ products = [] }) {
  // Un producto por categoría, en el orden en que aparecen
  const seenCategories = new Set();
  const featuredProducts = [];
  for (const p of products) {
    const cat = p?.category;
    if (!cat || typeof cat !== "string" || cat.trim() === "") continue;
    if (seenCategories.has(cat)) continue;
    seenCategories.add(cat);
    featuredProducts.push(p);
  }

  const carouselItems = featuredProducts.map((p) => ({
    id: p.id,
    title: p.title,
    desc: stripHtml(p.description).slice(0, 90),
    img: (p.images && p.images[0]) || p.image || "",
    href: "/productos",
  }));

  return (
    <Layout>
      {/* HERO */}
      <section className="relative">
        <div className="relative bg-primary h-[60vh] md:h-[70vh] w-full overflow-hidden flex items-center justify-center">
          <div className="relative z-10 text-center px-6 max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-title text-white drop-shadow-md">
              Seona Deco
            </h1>

            <p className="mt-4 text-lg md:text-xl text-white/90">
              Decoración y aromatización para tus espacios.
            </p>

            <p className="mt-3 text-white/80 max-w-xl mx-auto">
              Encontrá productos pensados para darle calidez, estilo y
              personalidad a cada ambiente.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <a
                href="/productos"
                className="inline-block bg-white text-primary font-medium px-6 py-3 rounded shadow hover:shadow-lg transform hover:-translate-y-0.5 transition"
              >
                Ver productos
              </a>

              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary-dark text-white font-medium px-6 py-3 rounded shadow hover:shadow-lg transform hover:-translate-y-0.5 transition border border-white/20"
              >
                Contactanos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CARRUSEL DE PRODUCTOS */}
      {carouselItems.length > 0 && (
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-semibold text-primary mb-6">
              Nuestros productos
            </h2>
            <Carousel items={carouselItems} />
          </div>
        </section>
      )}

        {/* FEATURE GRID */}
        {/* Envíos, pagos, personalización y combos: redactado como invitación a
          consultar, sin afirmar políticas comerciales no confirmadas por
          Seona Deco */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <article className="bg-secondary-light rounded-lg p-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary/10 text-2xl">
              🚚
            </div>
            <h3 className="text-lg font-semibold text-primary">Envíos</h3>
            <p className="text-sm text-gray-600">
              Consultanos por las opciones de envío disponibles para tu zona.
            </p>
          </article>

          <article className="bg-secondary-light rounded-lg p-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary/10 text-2xl">
              💳
            </div>
            <h3 className="text-lg font-semibold text-primary">
              Medios de pago
            </h3>
            <p className="text-sm text-gray-600">
              Consultanos por los medios de pago disponibles al momento de tu
              compra.
            </p>
          </article>

          <article className="bg-secondary-light rounded-lg p-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary/10 text-2xl">
              ✨
            </div>
            <h3 className="text-lg font-semibold text-primary">
              Personalizaciones
            </h3>
            <p className="text-sm text-gray-600">
              Consultanos por las opciones de personalización disponibles para
              tus productos.
            </p>
          </article>

          <article className="bg-secondary-light rounded-lg p-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary/10 text-2xl">
              🎁
            </div>
            <h3 className="text-lg font-semibold text-primary">Combos</h3>
            <p className="text-sm text-gray-600">
              Consultanos por los combos disponibles para armar tu opción ideal.
            </p>
          </article>
        </div>
      </section>
    </Layout>
  );
}