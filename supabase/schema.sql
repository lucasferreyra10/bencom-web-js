-- Habilitar extensión pgcrypto para UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla: products
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    titulo TEXT,
    precio TEXT,
    stock TEXT,
    variantes_stock JSONB,
    descripcion TEXT,
    descripcion_larga TEXT,
    imagenes TEXT,
    cantidad_imagenes INTEGER,
    disclaimer TEXT,
    variantes_ids TEXT,
    variantes_labels TEXT,
    dropdown TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla: services
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT,
    description TEXT,
    items JSONB,
    folder TEXT,
    images JSONB,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla: about_content
CREATE TABLE IF NOT EXISTS public.about_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section TEXT UNIQUE NOT NULL,
    content TEXT,
    whatsapp_number TEXT,
    email TEXT,
    instagram_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurar RLS (Row Level Security)

-- Habilitar RLS en las tablas
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

-- Políticas para 'products'
CREATE POLICY "Lectura pública para products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Escritura autenticada para products" ON public.products FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para 'services'
CREATE POLICY "Lectura pública para services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Escritura autenticada para services" ON public.services FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para 'about_content'
CREATE POLICY "Lectura pública para about_content" ON public.about_content FOR SELECT USING (true);
CREATE POLICY "Escritura autenticada para about_content" ON public.about_content FOR ALL USING (auth.role() = 'authenticated');

-- Insertar datos iniciales para about_content
INSERT INTO public.about_content (section, content, whatsapp_number, email, instagram_url)
VALUES (
    'general', 
    'Somos BENCOM S.R.L...', 
    '', 
    'mantenimiento@bencom.com.ar', 
    'https://instagram.com/bencomsrl'
) ON CONFLICT (section) DO NOTHING;

-- Configurar Storage (Bucket 'media')
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para 'media'
CREATE POLICY "Lectura pública para media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Inserción autenticada para media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Actualización autenticada para media" ON storage.objects FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Eliminación autenticada para media" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
