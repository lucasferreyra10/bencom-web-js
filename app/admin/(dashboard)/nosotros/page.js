'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

export default function NosotrosAdmin() {
  const [formData, setFormData] = useState({
    content: '',
    whatsapp_number: '',
    email: '',
    instagram_url: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .eq('section', 'general')
        .single()

      if (data) {
        setFormData({
          content: data.content || '',
          whatsapp_number: data.whatsapp_number || '',
          email: data.email || '',
          instagram_url: data.instagram_url || '',
        })
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const { error } = await supabase
      .from('about_content')
      .update({
        content: formData.content,
        whatsapp_number: formData.whatsapp_number,
        email: formData.email,
        instagram_url: formData.instagram_url,
        updated_at: new Date().toISOString()
      })
      .eq('section', 'general')

    if (error) {
      setMessage({ type: 'error', text: 'Error al guardar: ' + error.message })
    } else {
      setMessage({ type: 'success', text: 'Información actualizada correctamente.' })
    }
    setSaving(false)
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-3xl font-title text-primary tracking-wide">SECCIÓN NOSOTROS</h2>
        <p className="text-gray-500 mt-2 text-sm">
          Actualiza la información pública de contacto y la descripción de la empresa.
        </p>
      </div>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          <span className="font-medium">{message.type === 'error' ? 'Error:' : '¡Éxito!'}</span> 
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Texto Principal (Descripción)
          </label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            className="bg-white rounded-lg mb-12"
            style={{ height: '200px' }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Número de WhatsApp
            </label>
            <input
              type="text"
              name="whatsapp_number"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition-colors shadow-sm"
              value={formData.whatsapp_number}
              onChange={handleChange}
              placeholder="+5491100000000"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition-colors shadow-sm"
              value={formData.email}
              onChange={handleChange}
              placeholder="mantenimiento@bencom.com.ar"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            URL de Instagram
          </label>
          <input
            type="url"
            name="instagram_url"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 transition-colors shadow-sm"
            value={formData.instagram_url}
            onChange={handleChange}
            placeholder="https://instagram.com/tu-cuenta"
          />
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary-light transition-colors focus:outline-none focus:ring-4 focus:ring-secondary focus:ring-opacity-50 disabled:opacity-70 shadow-md"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
