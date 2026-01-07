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
let excelData = null;

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
  excelData = null;
  fileAttachmentReset();
};

downloadWordBtn.onclick = () => {
  if (!excelData) return;
  console.log('Generando Word con empresa:', empresa);
  generateWordByEmpresa(excelData, empresa); // 👈 ahora dinámico
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

  downloadWordBtn.classList.add('hidden'); // 👈 ocultar Word también
  downloadWordBtn.disabled = true;
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

    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: '',
    });

    excelData = {};

    rows.forEach((row) => {
      if (!row[0]) return;
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

    selectBtn.classList.add('hidden');
    dropArea.querySelector('p').classList.add('hidden');

    downloadWordBtn.classList.remove('hidden'); // 👈 mostrar Word
    downloadWordBtn.disabled = false;

    console.log('Datos Excel:', excelData);
  } catch (err) {
    console.error(err);
    fileStatus.textContent = '❌ Error al cargar el Excel';
    fileAttachmentReset();
  } finally {
    spinner.classList.add('hidden');
  }
}
