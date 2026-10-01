// pages/servicios/[slug].js

import { useRouter } from "next/router";
import ServicePage from "../../components/ServicePage";
import { supabasePublic } from "../../lib/supabase/public";

export async function getServerSideProps({ params }) {
  const { slug } = params;
  
  // Fetch the main service
  const { data: service, error: serviceError } = await supabasePublic
    .from("services")
    .select("*")
    .eq("slug", slug)
    .single();

  if (serviceError || !service) {
    return { notFound: true };
  }

  // Fetch other services
  const { data: allServices, error: otherError } = await supabasePublic
    .from("services")
    .select("*")
    .neq("slug", slug)
    .order("order_index", { ascending: true });

  const otherServices = (allServices || []).map((s) => ({
    id: s.slug,
    title: s.title,
    description: s.description,
    list: s.items ? s.items.slice(0, 10) : [],
    images: s.images ? s.images.slice(0, 50) : [],
  }));

  return {
    props: {
      service,
      otherServices,
    },
  };
}

export default function ServicioDinamico({ service, otherServices }) {
  const router = useRouter();

  if (router.isFallback || !service) {
    return <div>Cargando...</div>;
  }

  // Use the full image URLs stored in Supabase
  const images = service.images || [];

  return (
    <ServicePage
      title={service.title}
      description={service.description}
      items={service.items || []}
      images={images}
      otherServices={otherServices}
    />
  );
}