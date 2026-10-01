const fs = require('fs')
const Papa = require('papaparse')
const { createClient } = require('@supabase/supabase-js')

require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Faltan variables SUPABASE en .env.local")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/14jeIzea_CdTOPF77KS3QamuYkupPUuPvwlCYjTgFRSs/export?format=csv'

async function seed() {
  console.log("Descargando CSV desde Google Sheets...")
  const res = await fetch(SHEET_URL)
  if (!res.ok) {
    console.error("Error al descargar CSV:", res.statusText)
    process.exit(1)
  }
  
  const csvText = await res.text()
  
  console.log("Parseando CSV...")
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  })

  const rows = parsed.data

  console.log(`Se encontraron ${rows.length} productos. Formateando...`)

  const formattedRows = rows.map(row => {
    const dropdownStr = row['@dropdown'] || ''
    
    let variantes_stock = null
    if (row.variantes_stock) {
      try {
        const arr = row.variantes_stock.split(';').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x))
        if (arr.length > 0) {
          variantes_stock = arr
        }
      } catch (e) {
        variantes_stock = row.variantes_stock
      }
    }

    let cantidad_imagenes = parseInt(row.cantidad_imagenes, 10)
    if (isNaN(cantidad_imagenes)) cantidad_imagenes = 0

    return {
      id: row.id,
      titulo: row.titulo || '',
      precio: row.precio || null,
      stock: row.stock || null,
      variantes_stock: variantes_stock,
      descripcion: row.descripcion || '',
      descripcion_larga: row.descripcion_larga || '',
      imagenes: row.imagenes || '',
      cantidad_imagenes: cantidad_imagenes,
      disclaimer: row.disclaimer || '',
      variantes_ids: row.variantes_ids || '',
      variantes_labels: row.variantes_labels || '',
      dropdown: dropdownStr
    }
  })

  console.log("Insertando productos en Supabase (Usando UPSERT para no duplicar)...")
  
  // Usamos UPSERT por si ya existen
  const { data, error } = await supabase.from('products').upsert(formattedRows)
  
  if (error) {
    console.error("\n❌ ERROR AL INSERTAR PRODUCTOS:")
    console.error(error.message)
    if (error.code === '42501') {
      console.error("\n⚠️ IMPORTANTE: Parece que te faltan los PERMISOS (GRANTS) en tu base de datos.")
      console.error("Por favor ve a tu panel de Supabase -> SQL Editor y ejecuta esto:")
      console.error("GRANT ALL ON public.products TO anon, authenticated, service_role;")
      console.error("GRANT ALL ON public.services TO anon, authenticated, service_role;")
      console.error("GRANT ALL ON public.about_content TO anon, authenticated, service_role;")
    }
  } else {
    console.log("\n✅ ¡Productos importados correctamente! Revisa tu panel.")
  }
}

seed()
