import Layout from "../components/Layout";

export default function Productos() {
  return (
    <Layout>
      <section className="space-y-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-3xl font-title">Nuestros Productos</h2>
          <p>
            Visitá nuestra tienda online:
            <a
              href="https://tienda.bencom.com.ar"
              target="_blank"
              rel="noopener"
              className="text-secondary underline"
            >
              Entrar a la tienda
            </a>
          </p>
        </div>
      </section>
    </Layout>
  );
}
