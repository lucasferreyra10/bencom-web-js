'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadFile } from '@/lib/supabase/storage'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function ServiciosAdmin() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [editingService, setEditingService] = useState(null)
  
  const supabase = createClient()

  const fetchServices = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (data) setServices(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return
    
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (!error) {
      fetchServices()
    } else {
      alert('Error eliminando: ' + error.message)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = services.findIndex((s) => s.id === active.id);
      const newIndex = services.findIndex((s) => s.id === over.id);
      
      const newServices = arrayMove(services, oldIndex, newIndex);
      
      const updatedServices = newServices.map((s, index) => ({
        ...s,
        order_index: index + 1
      }));
      setServices(updatedServices);

      for (const service of updatedServices) {
         await supabase.from('services').update({ order_index: service.order_index }).eq('id', service.id);
      }
    }
  };

  if (loading && !editingService) return <div className="p-8 text-center text-gray-500">Cargando servicios...</div>

  if (editingService !== null) {
    return (
      <ServiceForm 
        service={editingService} 
        onCancel={() => setEditingService(null)} 
        onSave={() => {
          setEditingService(null)
          fetchServices()
        }}
      />
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b pb-4">
        <div>
          <h2 className="text-3xl font-title text-primary tracking-wide uppercase">Servicios</h2>
          <p className="text-gray-500 mt-1 text-sm">Gestiona los servicios ofrecidos por la empresa.</p>
        </div>
        <button 
          onClick={() => setEditingService({})}
          className="bg-secondary text-white px-5 py-2.5 rounded-lg hover:bg-secondary-light font-medium shadow-md transition-colors flex items-center gap-2"
        >
          <span className="font-bold text-lg leading-none">+</span> Agregar Servicio
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">Orden</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">Título</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-primary uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <tbody className="divide-y divide-gray-200 bg-white">
                {services.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No hay servicios registrados. Haz clic en "Agregar Servicio" para comenzar.
                    </td>
                  </tr>
                ) : (
                  <SortableContext 
                    items={services.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {services.map((s) => (
                      <SortableRow key={s.id} service={s} onEdit={setEditingService} onDelete={handleDelete} />
                    ))}
                  </SortableContext>
                )}
              </tbody>
            </DndContext>
          </table>
        </div>
      </div>
    </div>
  )
}

function ServiceForm({ service, onCancel, onSave }) {
  const isNew = !service.id
  
  const [formData, setFormData] = useState({
    slug: service.slug || '',
    title: service.title || '',
    description: service.description || '',
    folder: service.folder || '',
    order_index: service.order_index || 0,
  })

  // Arrays from JSONB
  const [items, setItems] = useState(service.items || [])
  const [images, setImages] = useState(service.images || [])

  const [saving, setSaving] = useState(false)
  const [files, setFiles] = useState([])
  const supabase = createClient()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleItemChange = (index, value) => {
    const newItems = [...items]
    newItems[index] = value
    setItems(newItems)
  }

  const handleAddItem = () => setItems([...items, ''])
  const handleRemoveItem = (index) => setItems(items.filter((_, i) => i !== index))

  const handleRemoveImage = (index) => setImages(images.filter((_, i) => i !== index))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.slug || !formData.title) {
      alert('El Slug y Título son obligatorios')
      return
    }

    setSaving(true)
    
    let currentImages = [...images]
    
    if (files.length > 0) {
      for (const file of files) {
        try {
          const url = await uploadFile(file, 'media', `servicios/${formData.slug}`)
          currentImages.push(url)
        } catch (err) {
          console.error('Error subiendo imagen', err)
          alert('Error al subir imagen: ' + err.message)
        }
      }
    }

    // Limpiar items vacíos
    const cleanItems = items.filter(item => item.trim() !== '')

    const payload = {
      ...formData,
      items: cleanItems,
      images: currentImages,
      order_index: parseInt(formData.order_index, 10) || 0
    }

    let error;
    if (isNew) {
      const { error: insertError } = await supabase.from('services').insert([payload])
      error = insertError
    } else {
      const { error: updateError } = await supabase.from('services').update(payload).eq('id', service.id)
      error = updateError
    }

    setSaving(false)

    if (error) {
      alert('Error guardando servicio: ' + error.message)
    } else {
      onSave()
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-2xl font-title text-primary tracking-wide">{isNew ? 'NUEVO SERVICIO' : 'EDITAR SERVICIO'}</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (ID para URL ej. "mantenimiento")</label>
            <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 shadow-sm transition-colors" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={(e) => {
                const title = e.target.value;
                const slug = title
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9-]/g, '')
                  .replace(/-+/g, '-')
                  .replace(/^-+|-+$/g, '');
                setFormData({ ...formData, title, slug });
              }} 
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 shadow-sm transition-colors" 
              required 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 shadow-sm transition-colors resize-none" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Items (Lista de características)</label>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-gray-400 font-bold">{index + 1}.</span>
                <input 
                  type="text" 
                  value={item} 
                  onChange={(e) => handleItemChange(index, e.target.value)} 
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 shadow-sm transition-colors"
                  placeholder="Ej. Limpieza general"
                />
                <button type="button" onClick={() => handleRemoveItem(index)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar item">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddItem} className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-secondary hover:text-white border-2 border-secondary hover:bg-secondary w-full sm:w-auto px-4 py-2 rounded-lg transition-colors">
            <span>+</span> Añadir Característica
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Carpeta (opcional)</label>
            <input type="text" name="folder" value={formData.folder} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 shadow-sm transition-colors" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">Imágenes Actuales</label>
          {images.length === 0 ? (
            <p className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg">No hay imágenes en la galería para este servicio.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              {images.map((img, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm aspect-video bg-white flex items-center justify-center">
                  <img src={img} alt={`Img ${index}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={() => handleRemoveImage(index)}
                      className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                      title="Eliminar imagen"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Subir Nuevas Imágenes</label>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <input 
              type="file" 
              multiple 
              accept="image/*"
              onChange={(e) => setFiles(Array.from(e.target.files))} 
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-secondary-light cursor-pointer text-gray-600" 
            />
          </div>
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
            ) : 'Guardar Servicio'}
          </button>
        </div>
      </form>
    </div>
  )
}

function SortableRow({ service, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    position: isDragging ? 'relative' : 'static',
  };

  return (
    <tr ref={setNodeRef} style={style} className={`hover:bg-gray-50 transition-colors bg-white ${isDragging ? 'shadow-xl opacity-90' : ''}`}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
        <div className="flex items-center gap-2">
           <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
           {service.order_index}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{service.slug}</td>
      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{service.title}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium z-10 relative">
        <button onPointerDown={(e) => e.stopPropagation()} onClick={() => onEdit(service)} className="text-secondary hover:text-secondary-light mr-4 transition-colors font-semibold relative z-20 cursor-pointer">Editar</button>
        <button onPointerDown={(e) => e.stopPropagation()} onClick={() => onDelete(service.id)} className="text-red-500 hover:text-red-700 transition-colors font-semibold relative z-20 cursor-pointer">Eliminar</button>
      </td>
    </tr>
  );
}
