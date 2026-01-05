export async function generateWord(excelData) {
  const get = (label) => excelData[label] || '';

  // 1) Cargar plantilla Word
  // Detectar si estás en GitHub Pages y extraer el nombre del repo
const pathParts = window.location.pathname.split('/');
const repoName = pathParts[1] || ''; // en GitHub Pages será "mi-proyecto", en local será vacío

const baseUrl = window.location.origin + (repoName ? '/' + repoName : '');
const resp = await fetch(`${baseUrl}/templates/word/carroceria/carga/fanalca.docx`);

  const arrayBuffer = await resp.arrayBuffer();

  // 2) Preparar zip y docxtemplater
  const zip = new window.PizZip(arrayBuffer);
  const doc = new window.docxtemplater().loadZip(zip);

  // 3) Setear datos dinámicos
  doc.setData({
    FECHA: new Date().toLocaleDateString(),
    TIPO_HOMOLOGACION: get('1. TIPO DE HOMOLOGACIÓN'),
    CLASE_VEHICULO: get('2. CLASE DE VEHÍCULO'),
    TIPO_CARROCERIA: get('3. TIPO DE CARROCERÍA'),
    MARCA: get('MARCA'),
    REFERENCIA: get('REFERENCIA'),
    MODELO: get('MODELO'),
    SERVICIO: get('SERVICIO'),
    OPERACION: get('OPERACIÓN'),
  });

  // 4) Renderizar
  try {
    doc.render();
  } catch (e) {
    console.error('Error al renderizar docx:', e);
    return;
  }

  // 5) Generar blob y descargar
  const out = doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  const a = document.createElement('a');
  a.href = URL.createObjectURL(out);
  a.download = `Certificacion_${get('REFERENCIA') || 'vehiculo'}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(a.href), 500);
}
