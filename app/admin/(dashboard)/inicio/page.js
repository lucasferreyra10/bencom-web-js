'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AVAILABLE_ICONS, DEFAULT_HOME_FEATURES } from '@/lib/constants'
import Link from 'next/link'

function IconSelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  const selectedIcon = AVAILABLE_ICONS.find((i) => i.value === value) || {
    value: value || AVAILABLE_ICONS[0].value,
    label: value ? 'Icono personalizado' : AVAILABLE_ICONS[0].label,
    category: 'Otro'
  }

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredIcons = AVAILABLE_ICONS.filter(
    (icon) =>
      icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (icon.category && icon.category.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
        Icono
      </label>
      
      {/* Botón selector que abre el desplegable */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-left"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
            <img
              src={selectedIcon.value}
              alt={selectedIcon.label}
              className="w-5 h-5 object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </div>
          <div className="truncate">
            <p className="text-sm font-medium text-gray-900 truncate">
              {selectedIcon.label}
            </p>
            <p className="text-xs text-gray-400 font-mono truncate">
              {selectedIcon.value.replace('/icons/', '')}
            </p>
          </div>
        </div>
        
        <span className="ml-2 text-gray-400">
          <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden max-h-80 flex flex-col">
          {/* Buscador de iconos */}
          <div className="p-2 border-b border-gray-100 bg-gray-50">
            <input
              type="text"
              placeholder="Buscar icono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
          </div>

          {/* Lista de opciones de iconos */}
          <div className="overflow-y-auto divide-y divide-gray-50 p-1 flex-1">
            {filteredIcons.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">No se encontraron iconos</p>
            ) : (
              filteredIcons.map((icon) => {
                const isCurrent = icon.value === value
                return (
                  <button
                    key={icon.value}
                    type="button"
                    onClick={() => {
                      onChange(icon.value)
                      setIsOpen(false)
                      setSearchTerm('')
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                      isCurrent
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <img
                          src={icon.value}
                          alt={icon.label}
                          className="w-4 h-4 object-contain"
                        />
                      </div>
                      <div className="truncate">
                        <div className="text-xs truncate font-medium">{icon.label}</div>
                        <div className="text-[10px] text-gray-400 font-mono truncate">{icon.value.replace('/icons/', '')}</div>
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="text-primary text-xs font-bold mr-1">✓</span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function InicioAdmin() {
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('about_content')
          .select('content')
          .eq('section', 'home_features')
          .maybeSingle()

        if (data?.content) {
          try {
            const parsed = JSON.parse(data.content)
            if (Array.isArray(parsed) && parsed.length > 0) {
              setFeatures(parsed)
              setLoading(false)
              return
            }
          } catch (e) {
            console.error('Error al analizar json de home_features:', e)
          }
        }

        // Si no hay datos en la base de datos, usamos los predeterminados
        setFeatures(DEFAULT_HOME_FEATURES)
      } catch (err) {
        console.error('Error al consultar home_features:', err)
        setFeatures(DEFAULT_HOME_FEATURES)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFeatureChange = (index, field, value) => {
    const updated = [...features]
    updated[index] = { ...updated[index], [field]: value }
    setFeatures(updated)
  }

  const handleAddFeature = () => {
    const newId = features.length > 0 ? Math.max(...features.map((f) => Number(f.id) || 0)) + 1 : 1
    const newFeature = {
      id: newId,
      icon: AVAILABLE_ICONS[0].value,
      title: 'Nueva Característica',
      description: 'Descripción breve de la característica.',
    }
    setFeatures([...features, newFeature])
  }

  const handleRemoveFeature = (index) => {
    if (features.length <= 1) {
      alert('Debe haber al menos una característica en la cuadrícula.')
      return
    }
    if (confirm('¿Estás seguro de eliminar este elemento?')) {
      const updated = features.filter((_, i) => i !== index)
      setFeatures(updated)
    }
  }

  const handleMove = (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= features.length) return
    const updated = [...features]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    setFeatures(updated)
  }

  const handleResetDefaults = () => {
    if (confirm('¿Deseas restablecer los 4 elementos predeterminados de la portada?')) {
      setFeatures(DEFAULT_HOME_FEATURES)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      // Verificar si ya existe el registro
      const { data: existing } = await supabase
        .from('about_content')
        .select('id')
        .eq('section', 'home_features')
        .maybeSingle()

      let result
      if (existing?.id) {
        result = await supabase
          .from('about_content')
          .update({
            content: JSON.stringify(features),
            updated_at: new Date().toISOString(),
          })
          .eq('section', 'home_features')
      } else {
        result = await supabase
          .from('about_content')
          .insert({
            section: 'home_features',
            content: JSON.stringify(features),
            updated_at: new Date().toISOString(),
          })
      }

      if (result.error) {
        setMessage({ type: 'error', text: 'Error al guardar: ' + result.error.message })
      } else {
        setMessage({ type: 'success', text: '¡Características de la página principal actualizadas correctamente!' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error inesperado: ' + err.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <svg className="animate-spin h-6 w-6 mr-3 text-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Cargando configuración de la página principal...
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Encabezado */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏠</span>
            <h2 className="text-3xl font-title text-primary tracking-wide uppercase">
              Portada / Inicio (Index)
            </h2>
          </div>
          <p className="text-gray-500 mt-2 text-sm max-w-2xl">
            Modifica los elementos destacados (Feature grid) que aparecen al pie de la página principal:
            selecciona el icono deseado mediante el menú desplegable y personaliza el título y la descripción.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Ver Sitio Web</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Alerta de Éxito / Error */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between gap-3 shadow-sm ${
            message.type === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{message.type === 'error' ? '⚠️' : '✅'}</span>
            <span className="text-sm font-medium">{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-gray-400 hover:text-gray-600 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Vista previa en tiempo real */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">👁️</span>
            <h3 className="text-lg font-bold text-gray-800">
              Vista Previa en Tiempo Real
            </h3>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            Exactamente como se verá en la Portada
          </span>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl border border-dashed border-gray-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((item, idx) => (
              <article
                key={item.id || idx}
                className="bg-[#DFDFDF] rounded-lg p-6 flex flex-col items-center text-center gap-3 transition-all hover:shadow-md"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary/10 shrink-0">
                  <img
                    src={item.icon || AVAILABLE_ICONS[0].value}
                    alt={item.title || 'Icono'}
                    className="w-7 h-7 md:w-8 md:h-8 object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-primary">
                  {item.title || '(Sin título)'}
                </h3>
                <p className="text-sm text-gray-600 leading-snug">
                  {item.description || '(Sin descripción)'}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Formulario de Edición de Características */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Editar Elementos del Feature Grid ({features.length})
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Personaliza el icono desplegable, título (h3) y descripción (p) de cada bloque.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs text-gray-600 hover:text-red-600 font-medium px-3 py-2 rounded-lg border border-gray-300 hover:border-red-300 bg-white transition-colors"
            >
              ↺ Restablecer Predeterminados
            </button>
            <button
              type="button"
              onClick={handleAddFeature}
              className="text-xs text-white bg-secondary hover:bg-secondary-light font-medium px-3.5 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span className="text-base font-bold leading-none">+</span>
              <span>Agregar Elemento</span>
            </button>
          </div>
        </div>

        {/* Lista de tarjetas editables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.id || index}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between transition-all hover:border-primary/40"
            >
              <div className="space-y-4">
                {/* Cabecera del bloque */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      Elemento #{index + 1}
                    </span>
                  </div>

                  {/* Acciones de reordenar y eliminar */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, -1)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-25 rounded hover:bg-gray-100"
                      title="Mover arriba"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={index === features.length - 1}
                      onClick={() => handleMove(index, 1)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-25 rounded hover:bg-gray-100"
                      title="Mover abajo"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="p-1.5 text-red-400 hover:text-red-600 rounded hover:bg-red-50 ml-1"
                      title="Eliminar elemento"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* 1. Selector Desplegable de Icono */}
                <IconSelector
                  value={feature.icon}
                  onChange={(newIcon) => handleFeatureChange(index, 'icon', newIcon)}
                />

                {/* 2. Campo Título (h3) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Título (h3)
                  </label>
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                    placeholder="Ej: Trabajos en AMBA"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  />
                </div>

                {/* 3. Campo Descripción (p) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Descripción (p)
                  </label>
                  <textarea
                    rows={3}
                    value={feature.description}
                    onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                    placeholder="Ej: Realizamos trabajos en CABA y Gran Buenos Aires."
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-600 resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Barra fija inferior con botón de guardar */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-20">
          <div className="text-xs text-gray-500">
            Los cambios se reflejarán instantáneamente en la portada al presionar guardar.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <span>💾 Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

