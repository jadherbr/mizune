import Moment from 'moment';

export function getFloatFromFormatedString(valor) {
  return parseFloat(valor.replace(/[^\d,-]/g, '').replace(',','.'));
}

/* export function setFloatField(formulario, campo) {
  console.log(formulario);
  console.log(campo);
  const oldv = formulario.getFieldValue(campo);
  console.log(typeof oldv);
  console.log(oldv);
  let newv = getFloatFromFormatedString(oldv);
  formulario.setFieldsValue({
    [campo]: parseFloat(newv)
  });
} */

export function numberToReal (numero) {
  let vNum = numero.toFixed(2).split('.');
  vNum[0] = "R$ " + vNum[0].split(/(?=(?:...)*$)/).join('.');
  return vNum.join(',');
}

export function getFormatedDate(stringdate) {
  let dt = new Moment(stringdate);
  return dt.format("DD/MM/YYYY");
}