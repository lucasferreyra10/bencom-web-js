import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Cliente básico sin manejo de cookies de sesión para obtener datos públicos
export const supabasePublic = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
