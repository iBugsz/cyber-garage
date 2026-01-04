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

  // Mostrar de nuevo texto y botón seleccionar
  selectBtn.classList.remove('hidden');
  dropArea.querySelector('p').classList.remove('hidden');

  // Ocultar botón descargar
  downloadPdfBtn.classList.add('hidden');
  downloadPdfBtn.disabled = true;
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
      defval: '',
    });

    excelData = {};

    rows.forEach((row) => {
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

    // Ocultar texto y botón seleccionar
    selectBtn.classList.add('hidden');
    dropArea.querySelector('p').classList.add('hidden');

    // Mostrar botón descargar
    downloadPdfBtn.classList.remove('hidden');
    downloadPdfBtn.disabled = false;

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
// GENERAR PDF CON html2pdf.js
// ==========================
downloadPdfBtn.onclick = async () => {
  if (!excelData) return;

  // Helper seguro
  const get = (label) => excelData[label] || '';

  const TIPO_HOMO = get('1. TIPO DE HOMOLOGACIÓN');
  const CLASE_VEH = get('2. CLASE DE VEHÍCULO');
  const TIPO_CAR = get('3. TIPO DE CARROCERÍA');
  const MARCA = get('MARCA');
  const REFERENCIA = get('REFERENCIA');
  const MODELO = get('MODELO');
  const SERVICIO = get('SERVICIO');
  const OPERACION = get('OPERACIÓN');

  // 1. Cargar la plantilla desde /templates/certificado.html
  const response = await fetch('./templates/plantilla1.html');
  const htmlText = await response.text();

  // 2. Crear un contenedor temporal y meter la plantilla
  const container = document.createElement('div');
  container.innerHTML = htmlText;

  // 3. Rellenar los placeholders
  container.querySelector('#TIPO_HOMO').textContent = TIPO_HOMO;
  container.querySelector('#CLASE_VEH').textContent = CLASE_VEH;
  container.querySelector('#TIPO_CAR').textContent = TIPO_CAR;
  container.querySelector('#MARCA').textContent = MARCA;
  container.querySelector('#REFERENCIA').textContent = REFERENCIA;
  container.querySelector('#MODELO').textContent = MODELO;
  container.querySelector('#SERVICIO').textContent = SERVICIO;
  container.querySelector('#OPERACION').textContent = OPERACION;

  // 4. Configuración de html2pdf
  const opt = {
    margin: 0,
    filename: `Certificacion_${REFERENCIA || 'vehiculo'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  // 5. Generar PDF desde la plantilla ya rellenada
  html2pdf().set(opt).from(container).outputPdf('dataurlnewwindow');
};
