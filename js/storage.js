import { supabase } from './supabase.js';

const bucketName = 'catalogos';
const folderName = 'archivos';

/* =========================
   📂 SUBIR ARCHIVO
========================= */
export async function subirArchivo(file) {
  try {
    const safeName = file.name.replace(/\s+/g, '_');
    const filePath = `${folderName}/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return {
      name: safeName,
      path: filePath,
      url: data.publicUrl,
    };
  } catch (err) {
    console.error('❌ Error al subir archivo:', err.message);
    return null;
  }
}

/* =========================
   📄 LISTAR ARCHIVOS
========================= */
export async function listarArchivos() {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderName, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) throw error;

    return data
      .filter((file) => file.name) // evita carpetas fantasma
      .map((file) => {
        const path = `${folderName}/${file.name}`;
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(path);

        return {
          name: file.name,
          path,
          url: urlData.publicUrl,
          createdAt: file.created_at,
        };
      });
  } catch (err) {
    console.error('❌ Error al listar archivos:', err.message);
    return [];
  }
}

/* =========================
   🗑️ ELIMINAR ARCHIVO
========================= */
export async function eliminarArchivo(path) {
  try {
    const { error } = await supabase.storage.from(bucketName).remove([path]);

    if (error) throw error;

    return true;
  } catch (err) {
    console.error('❌ Error al eliminar archivo:', err.message);
    return false;
  }
}

export async function descargarArchivo(path, nombre) {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(path);

    if (error) throw error;

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');

    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();

    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('❌ Error al descargar archivo:', err.message);
  }
}
