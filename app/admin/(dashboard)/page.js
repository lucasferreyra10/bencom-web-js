import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Bienvenido al Panel de Administración</h2>
      <p className="text-gray-600">
        Desde aquí puedes gestionar los productos, servicios y la información de la sección "Nosotros" de tu sitio web.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Link href="/admin/productos" className="block p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-primary transition-all group">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">Productos &rarr;</h3>
          <p className="text-sm text-gray-500">Administra el catálogo de productos, precios, stock y variantes.</p>
        </Link>
        <Link href="/admin/servicios" className="block p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-primary transition-all group">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">Servicios &rarr;</h3>
          <p className="text-sm text-gray-500">Actualiza los servicios ofrecidos y las galerías de imágenes.</p>
        </Link>
        <Link href="/admin/nosotros" className="block p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-primary transition-all group">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">Nosotros &rarr;</h3>
          <p className="text-sm text-gray-500">Edita la información de contacto y descripción de la empresa.</p>
        </Link>
      </div>
    </div>
  )
}

