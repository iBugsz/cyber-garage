import { getTemplatePath } from '../utils/path.js';

export async function generateWord(templateRelativePath, data) {
  const templatePath = getTemplatePath(templateRelativePath);
  console.log("Ruta usada:", templatePath);

  const resp = await fetch(templatePath);
  const arrayBuffer = await resp.arrayBuffer();

  const zip = new window.PizZip(arrayBuffer);
  const doc = new window.docxtemplater().loadZip(zip);

  doc.setData(data);

  try {
    doc.render();
  } catch (e) {
    console.error('Error al renderizar docx:', e);
    return;
  }

  const out = doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  const a = document.createElement('a');
  a.href = URL.createObjectURL(out);
  a.download = `Explicacion_carga.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(a.href), 500);
}
