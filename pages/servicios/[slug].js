// pages/servicios/[slug].js

import { useRouter } from "next/router";
import ServicePage from "../../components/ServicePage";
import { services } from "../../data/services";

export default function ServicioDinamico() {
  const router = useRouter();
  const { slug } = router.query;

  // Buscar el servicio actual
  const service = services.find((s) => s.slug === slug);

  // Si no se encuentra el servicio, mostrar mensaje
  if (!service) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Servicio no encontrado</h1>
      </div>
    );
  }

  // Construir las rutas completas de las imágenes
  const images = service.images.map((img) => `/services/${service.folder}/${img}`);

  // Construir el array de otros servicios (excluyendo el actual)
  const otherServices = services
    .filter((s) => s.slug !== slug)
    .map((s) => ({
      id: s.slug,
      title: s.title,
      description: s.description,
      list: s.items.slice(0, 10), // Mostrar solo los primeros 10 items
      images: s.images.slice(0, 50).map((img) => `/services/${s.folder}/${img}`), // Mostrar solo 50 imágenes
    }));

  return (
    <ServicePage
      title={service.title}
      description={service.description}
      items={service.items}
      images={images}
      otherServices={otherServices}
    />
  );
}