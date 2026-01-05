// js/pdf-generator.js
export async function generatePdf(excelData) {
  const get = (label) => excelData[label] || '';

  const TIPO_HOMO = get('1. TIPO DE HOMOLOGACIÓN');
  const CLASE_VEH = get('2. CLASE DE VEHÍCULO');
  const TIPO_CAR = get('3. TIPO DE CARROCERÍA');
  const MARCA = get('MARCA');
  const REFERENCIA = get('REFERENCIA');
  const MODELO = get('MODELO');
  const SERVICIO = get('SERVICIO');
  const OPERACION = get('OPERACIÓN');

  const response = await fetch('./templates/plantilla1.html');
  const htmlText = await response.text();

  const container = document.createElement('div');
  container.innerHTML = htmlText;

  container.querySelector('#TIPO_HOMO').textContent = TIPO_HOMO;
  container.querySelector('#CLASE_VEH').textContent = CLASE_VEH;
  container.querySelector('#TIPO_CAR').textContent = TIPO_CAR;
  container.querySelector('#MARCA').textContent = MARCA;
  container.querySelector('#REFERENCIA').textContent = REFERENCIA;
  container.querySelector('#MODELO').textContent = MODELO;
  container.querySelector('#SERVICIO').textContent = SERVICIO;
  container.querySelector('#OPERACION').textContent = OPERACION;

  const opt = {
    margin: 0,
    filename: `Certificacion_${REFERENCIA || 'vehiculo'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  html2pdf().set(opt).from(container).outputPdf('dataurlnewwindow');
}
