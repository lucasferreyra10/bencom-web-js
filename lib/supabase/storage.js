import { createClient } from './client'

export async function uploadFile(file, bucket = 'media', folder = 'general') {
  const supabase = createClient()
  
  // Manejo seguro del nombre y extensión del archivo para móviles
  let fileExt = 'jpeg'
  if (file.name) {
    const parts = file.name.split('.')
    if (parts.length > 1) {
      fileExt = parts.pop().toLowerCase()
    }
  } else if (file.type) {
    fileExt = file.type.split('/').pop()
  }
  
  // Limpiar extensión
  fileExt = fileExt.replace(/[^a-z0-9]/gi, '')
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'image/jpeg'
    })

  if (error) {
    throw error
  }

  // Obtener URL pública
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return publicUrlData.publicUrl
}
