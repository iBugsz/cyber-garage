// js/word-generator.js
export async function generateWord(excelData) {
  const get = (label) => excelData[label] || '';

  // 1. Cargar plantilla externa
  const resp = await fetch('./templates/word/certificacion.html');
  let htmlTemplate = await resp.text();

  // 2. Reemplazar marcadores
  htmlTemplate = htmlTemplate
    .replace('{{FECHA}}', new Date().toLocaleDateString())
    .replace('{{TIPO_HOMOLOGACION}}', get('1. TIPO DE HOMOLOGACIÓN'))
    .replace('{{CLASE_VEHICULO}}', get('2. CLASE DE VEHÍCULO'))
    .replace('{{TIPO_CARROCERIA}}', get('3. TIPO DE CARROCERÍA'))
    .replace('{{MARCA}}', get('MARCA'))
    .replace('{{REFERENCIA}}', get('REFERENCIA'))
    .replace('{{MODELO}}', get('MODELO'))
    .replace('{{SERVICIO}}', get('SERVICIO'))
    .replace('{{OPERACION}}', get('OPERACIÓN'));

  // 3. Convertir HTML a Word
  const blob = window.htmlDocx.asBlob(htmlTemplate);

  // 4. Descargar
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Certificacion_${get('REFERENCIA') || 'vehiculo'}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(a.href), 500);
}
