import { protectPage, setupLogout } from './auth.js';

// Protección y logout
protectPage();
setupLogout('logoutBtn');

// Elementos
const fileInput = document.getElementById('fileInput');
const dropArea = document.getElementById('dropArea');
const selectBtn = document.getElementById('selectFileBtn');
const fileName = document.getElementById('fileName');
const fileStatus = document.getElementById('fileStatus');
const memoryState = document.getElementById('memoryState');
const rowCount = document.getElementById('rowCount');
const spinner = document.getElementById('loadingSpinner');
const clearBtn = document.getElementById('clearFileBtn');

// Memoria global
let excelWorkbook = null;
let excelData = null;

// Click en botón elegir archivo
selectBtn.onclick = () => fileInput.click();

// Cambio de archivo
fileInput.addEventListener('change', handleFile);

// Drag & Drop refinado
dropArea.addEventListener('dragenter', (e) => {
  e.preventDefault();
  dropArea.classList.add('border-cyber');
});

dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('border-cyber');
});

dropArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  // Solo quitar borde si realmente sale del área
  if (!dropArea.contains(e.relatedTarget)) {
    dropArea.classList.remove('border-cyber');
  }
});

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('border-cyber');

  const dt = e.dataTransfer;
  if (!dt.files.length) return;
  fileInput.files = dt.files;
  handleFile();
});

// Quitar archivo
clearBtn.addEventListener('click', () => {
  excelWorkbook = null;
  excelData = null;
  fileInput.value = '';
  fileName.textContent = '';
  fileStatus.textContent = '';
  memoryState.textContent = 'NO';
  memoryState.className = 'text-red-400 font-semibold';
  rowCount.textContent = '0';
  clearBtn.classList.add('hidden');
});

// Función principal para leer archivo
async function handleFile() {
  if (!fileInput.files.length) return;
  const file = fileInput.files[0];
  fileName.textContent = `📄 ${file.name}`;
  fileStatus.textContent = '';
  spinner.classList.remove('hidden');
  memoryState.textContent = 'NO';
  memoryState.className = 'text-red-400 font-semibold';
  rowCount.textContent = '0';
  clearBtn.classList.remove('hidden');

  try {
    const buffer = await file.arrayBuffer();
    excelWorkbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = excelWorkbook.SheetNames[0];
    excelData = XLSX.utils.sheet_to_json(excelWorkbook.Sheets[sheetName], { defval: '' });

    fileStatus.innerHTML = `✅ Archivo cargado correctamente<br>📄 Hoja: <span class="text-cyber">${sheetName}</span>`;
    memoryState.textContent = 'SÍ';
    memoryState.className = 'text-green-400 font-semibold';
    rowCount.textContent = excelData.length;

    console.log('Excel en memoria:', excelData);
  } catch (err) {
    console.error(err);
    fileStatus.textContent = '❌ Error al cargar el archivo';
  } finally {
    spinner.classList.add('hidden');
  }
}

// Exponer datos globalmente
window.getExcelData = () => excelData;
