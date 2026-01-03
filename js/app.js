import { protectPage, setupLogout } from './auth.js';

// ==========================
// PROTECCIÓN
// ==========================
protectPage();
setupLogout('logoutBtn');

// ==========================
// ELEMENTOS
// ==========================
const fileInput = document.getElementById('fileInput');
const dropArea = document.getElementById('dropArea');
const selectBtn = document.getElementById('selectFileBtn');
const fileName = document.getElementById('fileName');
const fileStatus = document.getElementById('fileStatus');
const memoryState = document.getElementById('memoryState');
const rowCount = document.getElementById('rowCount');
const spinner = document.getElementById('loadingSpinner');
const clearBtn = document.getElementById('clearFileBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');

// ==========================
// MEMORIA
// ==========================
let excelData = null;

// ==========================
// BOTONES
// ==========================
selectBtn.onclick = () => fileInput.click();
fileInput.addEventListener('change', handleFile);

// ==========================
// DRAG & DROP
// ==========================
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('drag-active');
});

dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('drag-active');
});

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('drag-active');
  fileInput.files = e.dataTransfer.files;
  handleFile();
});

// ==========================
// LIMPIAR
// ==========================
clearBtn.onclick = () => {
  excelData = null;
  fileAttachmentReset();
};

function fileAttachmentReset() {
  fileInput.value = '';
  fileName.textContent = '';
  fileStatus.textContent = '';
  memoryState.textContent = 'NO';
  memoryState.className = 'text-red-400 font-semibold';
  rowCount.textContent = '0';
  clearBtn.classList.add('hidden');

  downloadPdfBtn.disabled = true;
  downloadPdfBtn.classList.add('opacity-40', 'cursor-not-allowed');
}

// ==========================
// LEER EXCEL (FORMATO VERTICAL)
// ==========================
async function handleFile() {
  if (!fileInput.files.length) return;

  const file = fileInput.files[0];
  fileName.textContent = `📄 ${file.name}`;
  spinner.classList.remove('hidden');

  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // 🔑 MATRIZ
    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: ''
    });

    excelData = {};

rows.forEach(row => {
  if (!row[0]) return; // sin etiqueta

  // Buscar el primer valor NO vacío a la derecha
  let value = '';
  for (let i = 1; i < row.length; i++) {
    if (row[i] !== '' && row[i] !== null && row[i] !== undefined) {
      value = row[i];
      break;
    }
  }

  excelData[row[0].toString().trim()] = value;
});


    if (!Object.keys(excelData).length) {
      throw new Error('Excel vacío');
    }

    fileStatus.textContent = '✅ Archivo cargado correctamente';
    memoryState.textContent = 'SÍ';
    memoryState.className = 'text-green-400 font-semibold';
    rowCount.textContent = Object.keys(excelData).length;
    clearBtn.classList.remove('hidden');

    downloadPdfBtn.disabled = false;
    downloadPdfBtn.classList.remove('opacity-40', 'cursor-not-allowed');

    // DEBUG
    console.log('Datos Excel:', excelData);

  } catch (err) {
    console.error(err);
    fileStatus.textContent = '❌ Error al cargar el Excel';
    fileAttachmentReset();
  } finally {
    spinner.classList.add('hidden');
  }
}

// ==========================
// GENERAR PDF (DATOS REALES)
// ==========================
downloadPdfBtn.onclick = () => {
  if (!excelData) return;

  const { jsPDF } = window.jspdf;

  // 🔑 Helper seguro
  const get = (label) => excelData[label] || '';

  const TIPO_HOMO = get('1. TIPO DE HOMOLOGACIÓN');
  const CLASE_VEH = get('2. CLASE DE VEHÍCULO');
  const TIPO_CAR  = get('3. TIPO DE CARROCERÍA');
  const MARCA     = get('MARCA');
  const REFERENCIA= get('REFERENCIA');
  const MODELO    = get('MODELO');
  const SERVICIO  = get('SERVICIO');
  const OPERACION = get('OPERACIÓN');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  let y = 20;

  // TITULO
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('CERTIFICACIÓN DE CARROCERÍA', 20, y);
  y += 12;

  doc.setFontSize(10);
  doc.setFont('Helvetica', 'normal');

  doc.text(`Tipo de homologación: ${TIPO_HOMO}`, 20, y); y += 6;
  doc.text(`Clase de vehículo: ${CLASE_VEH}`, 20, y); y += 6;
  doc.text(`Tipo de carrocería: ${TIPO_CAR}`, 20, y); y += 6;

  y += 4;
  doc.text(`Marca: ${MARCA}`, 20, y); y += 6;
  doc.text(`Referencia: ${REFERENCIA}`, 20, y); y += 6;
  doc.text(`Modelo: ${MODELO}`, 20, y); y += 6;
  doc.text(`Servicio: ${SERVICIO}`, 20, y); y += 6;
  doc.text(`Operación: ${OPERACION}`, 20, y); y += 10;

  doc.text(
    'Este documento se genera automáticamente a partir del archivo Excel cargado.',
    20,
    y
  );

  doc.save(`Certificacion_${REFERENCIA || 'vehiculo'}.pdf`);
};
