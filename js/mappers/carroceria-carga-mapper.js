// Mapper: convierte excelData en objeto data
export function mapExcelData(excelData) {
  const get = (label) => excelData[label] || '';

  return {
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
}
