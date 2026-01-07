export function mapExcelData(workbook, empresa) {
  // helper: obtiene valor de una hoja y celda con log
  const getCell = (sheetName, cell, fieldName) => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      console.warn(`⚠️ No existe la hoja "${sheetName}" para campo ${fieldName}`);
      return '';
    }
    const cellObj = sheet[cell];
    const value = cellObj ? cellObj.v : '';
    console.log(`📄 Campo ${fieldName}: hoja=${sheetName}, celda=${cell}, valor="${value}"`);
    return value;
  };

  // ejemplo: reglas distintas por empresa
  let referencia = '';
  if (empresa === 'fanalca') {
    referencia = getCell('FTH', 'C4', 'REFERENCIA (Fanalca)');
  } else if (empresa === 'ferrari_crane') {
    referencia = getCell('CHASIS', 'B7', 'REFERENCIA (Ferrari Crane)');
  }

  const data = {
    FECHA: new Date().toLocaleDateString(),
    TIPO_CARROCERIA:   getCell('FTH ', 'C6', 'TIPO_CARROCERIA'),
    MARCA:             getCell('FTH ', 'C9', 'MARCA'),
    REF_CARROCERIA:    getCell('FTH ', 'C91', 'REF_CARROCERIA'),
    REF_CHASIS:        getCell('FTH ', 'C10', 'REF_CHASIS'),
    CARGA_UTIL:        getCell('FTH ', 'C100', 'CARGA_UTIL'),

    WB:        getCell('MEDIDAS Y PESOS', 'B5', 'WB'),
    AE:        getCell('MEDIDAS Y PESOS', 'C5', 'AE'),
    BL:        getCell('MEDIDAS Y PESOS', 'D5', 'BL'),
    AC:        getCell('MEDIDAS Y PESOS', 'E5', 'AC'),
    LT:        getCell('MEDIDAS Y PESOS', 'F5', 'LT'),
    VA:        getCell('MEDIDAS Y PESOS', 'G5', 'VA'),

    PC_DEL:        getCell('MEDIDAS Y PESOS', 'K4', 'PC_DEL'),
    PC_TRA:        getCell('MEDIDAS Y PESOS', 'K5', 'PC_TRA'),
    PC_TOT:        getCell('MEDIDAS Y PESOS', 'K6', 'PC_TOT'),
    CAP_DEL:        getCell('MEDIDAS Y PESOS', 'L4', 'CAP_DEL'),
    CAP_TRA:        getCell('MEDIDAS Y PESOS', 'L5', 'CAP_TRA'),
    CAP_TOT:        getCell('MEDIDAS Y PESOS', 'L6', 'CAP_TOT'),
    CM_DEL:        getCell('MEDIDAS Y PESOS', 'M4', 'CM_DEL'),
    CM_TRA:        getCell('MEDIDAS Y PESOS', 'M5', 'CM_TRA'),
    CM_TOT:        getCell('MEDIDAS Y PESOS', 'M6', 'CM_TOT'),
  };

  console.log('✅ Datos mapeados para Word:', data);
  return data;
}
