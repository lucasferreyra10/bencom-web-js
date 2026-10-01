import { createClient } from './client'

export async function uploadFile(file, bucket = 'media', folder = 'general') {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) {
    throw error
  }

  // Obtener URL pública
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return publicUrlData.publicUrl
}
