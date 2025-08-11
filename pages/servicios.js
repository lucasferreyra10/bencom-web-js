// pages/servicios.js
import Layout from "../components/Layout";

export default function Servicios() {
  const destapaciones = ["Cloacas", "Pluviales", "Cocinas", "Lavaderos"];
  const atencionA = [
    "Consorcios",
    "Restaurantes",
    "Comercios",
    "Industrias",
    "Domicilios",
  ];
  const detalles = [
    "Trabajos garantizados",
    "No cobramos por metro",
    "Contamos con factura",
    "Aceptamos transferencias, tarjetas y cuenta corriente",
    "Atención en CABA y AMBA",
  ];
  const obrasMenores = [
    "Sendas",
    "Topes y Estacionamiento",
    "Pintura de Cordones",
    "Arreglos menores",
    "Proyectos",
    "Planeamiento de reformas",
    "Trabajos de Durlock",
    "Señalización Vial",
    "Herrerías",
    "Innovaciones",
    "Obra Civil Menor",
    "Plomería",
    "Destapaciones Pluviales",
    "Equipos de frío",
    "Pintura de Cañerías",
    "Nichos de incendio",
    "Oficinas",
    "Medianeras",
    "Impermeabilizaciones",
  ];

  return (
    <Layout>
      <section className="space-y-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-3xl font-title">Nuestros servicios</h2>
          <p>
            Ofrecemos soluciones de tecnología, comunicación y más para impulsar
            tu negocio.
          </p>

          {/* Destapaciones */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-title mb-4 border-b pb-2">
              Destapaciones
            </h2>
            <ul className="list-disc list-inside space-y-2 text-lg">
              {destapaciones.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Atención a */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-title mb-4 border-b pb-2">
              Atención a
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-lg">
              {atencionA.map((item) => (
                <li key={item} className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-secondary rounded-full mr-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Obra Menor */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-title mb-4 border-b pb-2">
              Compañía de Obras Menores
            </h2>
            <p className="mb-4 text-small">
              Nos dedicamos al mantenimiento integral de las siguientes
              instalaciones y especialidades:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg">
              {obrasMenores.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Detalles adicionales */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-title mb-4 border-b pb-2">Detalles</h2>
            <ul className="space-y-2 text-lg">
              {detalles.map((item) => (
                <li key={item}>✅ {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
}
