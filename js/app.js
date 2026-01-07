import { protectPage, setupLogout } from './auth.js';
import { generateWordByEmpresa } from './services/word-service.js'; // 👈 servicio dinámico

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
const downloadWordBtn = document.getElementById('downloadWordBtn'); // 👈 botón Word

// ==========================
// MEMORIA
// ==========================
let workbook = null; // 👈 guardamos el workbook entero

// ==========================
// EMPRESA (desde URL)
// ==========================
const params = new URLSearchParams(window.location.search);
const empresa = params.get('empresa'); // fanalca o ferrari_crane
console.log('Empresa seleccionada desde URL:', empresa);

// ==========================
// BOTONES
// ==========================
selectBtn.onclick = () => fileInput.click();
fileInput.addEventListener('change', handleFile);

clearBtn.onclick = () => {
  workbook = null;
  fileAttachmentReset();
};

downloadWordBtn.onclick = () => {
  if (!workbook) return;
  console.log('Generando Word con empresa:', empresa);
  generateWordByEmpresa(workbook, empresa); // 👈 pasamos workbook al mapper
};

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
function fileAttachmentReset() {
  fileInput.value = '';
  fileName.textContent = '';
  fileStatus.textContent = '';
  memoryState.textContent = 'NO';
  memoryState.className = 'text-red-400 font-semibold';
  rowCount.textContent = '0';
  clearBtn.classList.add('hidden');

  selectBtn.classList.remove('hidden');
  dropArea.querySelector('p').classList.remove('hidden');

  downloadWordBtn.classList.add('hidden');
  downloadWordBtn.disabled = true;
}

// ==========================
// LEER EXCEL (por workbook)
// ==========================
async function handleFile() {
  if (!fileInput.files.length) return;

  const file = fileInput.files[0];
  fileName.textContent = `📄 ${file.name}`;
  spinner.classList.remove('hidden');

  try {
    const buffer = await file.arrayBuffer();
    workbook = XLSX.read(buffer, { type: 'array' }); // 👈 guardamos workbook entero

    // contar filas de la primera hoja solo como referencia
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    if (!rows.length) throw new Error('Excel vacío');

    fileStatus.textContent = '✅ Archivo cargado correctamente';
    memoryState.textContent = 'SÍ';
    memoryState.className = 'text-green-400 font-semibold';
    rowCount.textContent = rows.length; // 👈 solo referencia
    clearBtn.classList.remove('hidden');

    selectBtn.classList.add('hidden');
    dropArea.querySelector('p').classList.add('hidden');

    downloadWordBtn.classList.remove('hidden');
    downloadWordBtn.disabled = false;

    console.log('Workbook cargado:', workbook);
    console.log('Hojas disponibles:', workbook.SheetNames);
  } catch (err) {
    console.error(err);
    fileStatus.textContent = '❌ Error al cargar el Excel';
    fileAttachmentReset();
  } finally {
    spinner.classList.add('hidden');
  }
}
