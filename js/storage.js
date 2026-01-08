import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://icnbvztrrkhmjugwavfn.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljbmJ2enRycmtobWp1Z3dhdmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4ODU1MDksImV4cCI6MjA4MzQ2MTUwOX0.d4207UJRb3gyGQ4mLKrAYVZ0Aa0G2xThOZJ2-qFbfTs';

export const supabase = createClient(supabaseUrl, supabaseKey);

// 🔹 Cambia este nombre por el nuevo bucket que vas a crear
const bucketName = 'catalogos';
// 🔹 Carpeta interna dentro del bucket
const folderName = 'archivos';

// 📂 Subir archivo dentro de la carpeta "archivos"
export async function subirArchivo(file) {
  const filePath = `${folderName}/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, { upsert: true });

  if (error) {
    console.error('❌ Error al subir:', error);
    return null;
  }

  const { data: publicUrl } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  console.log('✅ Archivo subido:', filePath, '→ URL:', publicUrl.publicUrl);
  return publicUrl.publicUrl;
}

// 📄 Listar archivos dentro de "archivos"
export async function listarArchivos() {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(folderName, { limit: 100 });

  if (error) {
    console.error('❌ Error al listar:', error);
    return [];
  }

  if (!data || data.length === 0) {
    console.warn('⚠️ No se encontraron archivos en la carpeta:', folderName);
    return [];
  }

  console.log('📁 Archivos encontrados en', folderName, ':', data);

  return data.map((file) => {
    const filePath = `${folderName}/${file.name}`;
    const { data: publicUrl } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return {
      name: file.name,
      url: publicUrl.publicUrl,
    };
  });
}
