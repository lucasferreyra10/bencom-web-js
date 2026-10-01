'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadFile } from '@/lib/supabase/storage'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

export default function ProductosAdmin() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // null = list view, {} = new product, {...product} = edit product
  const [editingProduct, setEditingProduct] = useState(null)
  
  const supabase = createClient()

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
    
    if (data) {
      // Natural sort by ID (e.g., p-1, p-2, p-10)
      const sorted = [...data].sort((a, b) => {
        const idA = String(a.id || '')
        const idB = String(b.id || '')
        return idA.localeCompare(idB, undefined, { numeric: true, sensitivity: 'base' })
      })
      setProducts(sorted)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) {
      fetchProducts()
    } else {
      alert('Error eliminando: ' + error.message)
    }
  }

  if (loading && !editingProduct) return <div className="p-8 text-center text-gray-500">Cargando productos...</div>

  if (editingProduct !== null) {
    return (
      <ProductForm 
        product={editingProduct} 
        onCancel={() => setEditingProduct(null)} 
        onSave={() => {
          setEditingProduct(null)
          fetchProducts()
        }}
      />
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b pb-4">
        <div>
          <h2 className="text-3xl font-title text-primary tracking-wide uppercase">Productos</h2>
          <p className="text-gray-500 mt-1 text-sm">Gestiona el catálogo de productos de la tienda.</p>
        </div>
        <button 
          onClick={() => setEditingProduct({})}
          className="bg-secondary text-white px-5 py-2.5 rounded-lg hover:bg-secondary-light font-medium shadow-md transition-colors flex items-center gap-2"
        >
          <span className="font-bold text-lg leading-none">+</span> Agregar Producto
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">Título</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">Precio</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-primary uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No hay productos registrados. Haz clic en "Agregar Producto" para comenzar.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{p.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{p.titulo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(!p.precio || p.precio === '0') ? '-' : p.precio}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.stock !== undefined && p.stock !== null && p.stock !== "" ? p.stock : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => setEditingProduct(p)} className="text-secondary hover:text-secondary-light mr-4 transition-colors font-semibold">Editar</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 transition-colors font-semibold">Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ProductForm({ product, onCancel, onSave }) {
  const isNew = !product.id
  const [formData, setFormData] = useState({
    id: product.id || '',
    titulo: product.titulo || '',
    precio: (product.precio && product.precio !== '0') ? product.precio : '',
    stock: product.stock || '',
    descripcion: product.descripcion || '',
    descripcion_larga: product.descripcion_larga || '',
    disclaimer: product.disclaimer || '',
    variantes_ids: product.variantes_ids || '',
    variantes_labels: product.variantes_labels || '',
    imagenes: product.imagenes || '',
    cantidad_imagenes: product.cantidad_imagenes || 0,
    variantes_stock: product.variantes_stock && Array.isArray(product.variantes_stock) ? product.variantes_stock.join(',') : (typeof product.variantes_stock === 'string' ? product.variantes_stock : '')
  })
  
  const [saving, setSaving] = useState(false)
  const [files, setFiles] = useState([])
  const supabase = createClient()

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['clean']
    ]
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleQuillChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.id || !formData.titulo) {
      alert('El ID y Título son obligatorios')
      return
    }

    setSaving(true)
    
    // Subir imágenes si se seleccionaron
    let currentImages = formData.imagenes ? formData.imagenes.split(/[,;]/).map(s=>s.trim()).filter(Boolean) : []
    
    if (files.length > 0) {
      for (const file of files) {
        try {
          const url = await uploadFile(file, 'media', 'productos')
          currentImages.push(url)
        } catch (err) {
          console.error('Error subiendo imagen', err)
          alert('Error al subir imagen: ' + err.message)
        }
      }
    }

    // Parse variantes_stock back into array of numbers
    let v_stock = null
    if (formData.variantes_stock) {
      v_stock = formData.variantes_stock.split(/[,;]/).map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n))
    }

    const payload = {
      ...formData,
      imagenes: currentImages.join(','),
      cantidad_imagenes: currentImages.length,
      variantes_stock: v_stock
    }

    let error;
    if (isNew) {
      const { error: insertError } = await supabase.from('products').insert([payload])
      error = insertError
    } else {
      const { error: updateError } = await supabase.from('products').update(payload).eq('id', product.id)
      error = updateError
    }

    setSaving(false)

    if (error) {
      alert('Error guardando producto: ' + error.message)
    } else {
      onSave()
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-2xl font-title text-primary tracking-wide">{isNew ? 'NUEVO PRODUCTO' : 'EDITAR PRODUCTO'}</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">ID (SKU)</label>
            <input type="text" name="id" value={formData.id} onChange={handleChange} disabled={!isNew} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 disabled:bg-gray-100 shadow-sm transition-colors" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
            <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 shadow-sm transition-colors" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Precio</label>
            <input type="text" name="precio" value={formData.precio} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 shadow-sm transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
            <input type="text" name="stock" value={formData.stock} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 shadow-sm transition-colors" placeholder="No agregar stock aquí si el producto tiene variantes."/>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción Breve</label>
          <div className="bg-white rounded-lg overflow-hidden border border-gray-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-30 shadow-sm transition-colors">
            <ReactQuill theme="snow" value={formData.descripcion} onChange={(val) => handleQuillChange('descripcion', val)} modules={quillModules} className="border-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción Larga</label>
          <div className="bg-white rounded-lg overflow-hidden border border-gray-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-30 shadow-sm transition-colors">
            <ReactQuill theme="snow" value={formData.descripcion_larga} onChange={(val) => handleQuillChange('descripcion_larga', val)} modules={quillModules} className="border-none" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Disclaimer</label>
          <div className="bg-white rounded-lg overflow-hidden border border-gray-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-30 shadow-sm transition-colors">
            <ReactQuill theme="snow" value={formData.disclaimer} onChange={(val) => handleQuillChange('disclaimer', val)} modules={quillModules} className="border-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Variantes IDs</label>
            <input type="text" name="variantes_ids" value={formData.variantes_ids} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 shadow-sm transition-colors" placeholder="Ej: v1,v2" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Variantes Labels</label>
            <input type="text" name="variantes_labels" value={formData.variantes_labels} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 shadow-sm transition-colors" placeholder="Ej: Rojo,Azul" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Variantes Stock</label>
            <input type="text" name="variantes_stock" value={formData.variantes_stock} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 shadow-sm transition-colors" placeholder="Ej: 10,5" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Imágenes (URLs actuales, separadas por coma)</label>
          <input type="text" name="imagenes" value={formData.imagenes} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 shadow-sm transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Subir Nuevas Imágenes</label>
          <input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={(e) => setFiles(Array.from(e.target.files))} 
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-secondary-light cursor-pointer text-gray-500 transition-colors" 
          />
          <p className="text-xs text-gray-500 mt-2">Se añadirán a las URLs actuales al guardar.</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
          <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="bg-secondary text-white px-6 py-2 rounded-lg font-medium hover:bg-secondary-light transition-colors disabled:opacity-70 flex items-center justify-center gap-2 w-full sm:w-auto shadow-md">
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : 'Guardar Producto'}
          </button>
        </div>
      </form>
    </div>
  )
}

