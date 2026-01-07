import { generateWord } from '../generators/word-generator.js';
import { mapExcelData } from '../mappers/carroceria-carga-mapper.js';

function getPlantillaByEmpresa(empresa) {
  switch (empresa) {
    case 'fanalca':
      return 'templates/word/carroceria/carga/fanalca.docx';
    case 'ferrari_crane':
      return 'templates/word/carroceria/carga/ferrari_crane.docx';
    default:
      throw new Error(`No existe plantilla para la empresa: ${empresa}`);
  }
}

export function generateWordByEmpresa(excelData, empresa) {
  const data = mapExcelData(excelData);
  const plantilla = getPlantillaByEmpresa(empresa);

  // Logs de prueba
  console.log(`Generando Word para empresa: ${empresa}`);
  console.log(`Plantilla seleccionada: ${plantilla}`);
  console.log('Datos mapeados:', data);

  generateWord(plantilla, data);
}
