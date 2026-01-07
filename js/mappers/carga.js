import { generateWord } from '../generators/word-generator.js';

export function generateFanalcaWord(excelData) {
  const get = (label) => excelData[label] || '';

  // Mapeo de campos específicos para la plantilla fanalca.docx
  const data = {
    FECHA: new Date().toLocaleDateString(),
    TIPO_HOMOLOGACION: get('1. TIPO DE HOMOLOGACIÓN'),
    CLASE_VEHICULO: get('2. CLASE DE VEHÍCULO'),
    TIPO_CARROCERIA: get('3.TIPO DE CARROCERÍA'),
    MARCA: get('MARCA'),
    REFERENCIA: get('REFERENCIA'),
    MODELO: get('MODELO'),
    SERVICIO: get('SERVICIO'),
    OPERACION: get('OPERACIÓN'),
    CARGA_UTIL: get('CARGA UTIL CALCULADA'),
  };

  // Llamada al generador genérico con la ruta de la plantilla
  generateWord('templates/word/carroceria/carga/fanalca.docx', data);
}
