-- 1. Eliminar la política de SELECT (Listar) de storage.objects para acceso público.
-- El acceso a las URLs de archivos en un bucket público ("media") funciona a nivel del sistema 
-- operativo del bucket y no requiere listar objetos.
DROP POLICY IF EXISTS "Lectura pública para media" ON storage.objects;
DROP POLICY IF EXISTS "Lectura pǧblica para media" ON storage.objects; -- (Por si acaso hubo problemas de codificación)

-- 2. Revocar los permisos de ejecución de rls_auto_enable (si existe) 
-- para evitar advertencias de seguridad sobre funciones accesibles públicamente
-- O alterar su seguridad a INVOKER
ALTER FUNCTION public.rls_auto_enable() SECURITY INVOKER;

-- Alternativa estricta:
-- REVOKE EXECUTE ON FUNCTION public.rls_auto_enable FROM anon, authenticated;

