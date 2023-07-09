export const validationPsw = (value: string | undefined): string => {
  const regNumber = /\d+/;
  const regLetter = /[A-Za-z]+/;
  const regSymbol = new RegExp("[`+\"~!@#$^&*()=|{}':;,\\[\\].<>/?…—‘”“_-]");
  if (value && value.length < 6){
    return '密码不能少于8位'
  } else if (value && value.length > 20){
    return '密码不能超过20位'
  }else if (value) {
    if (value.includes(' ')) return '必须包含字母、数字和特殊字符(不包括空格)'
    let flag = 0
    if (regNumber.test(value)) flag ++
    if (regLetter.test(value)) flag ++
    if (regSymbol.test(value)) flag ++
    if (flag !== 3) return '必须包含字母、数字和特殊字符(不包括空格)'
  }
  return ''
}
const initKey = '682864A5';//加密key
//DES加密
export const encryptByDES = (message: any, key = initKey) => {
  // @ts-ignore
  const keyHex = window.CryptoJS.enc.Utf8.parse(key);
  // @ts-ignore
  const encrypted = window.CryptoJS.DES.encrypt(message, keyHex, {mode: window.CryptoJS.mode.ECB, padding: window.CryptoJS.pad.Pkcs7});
  return encrypted.ciphertext.toString();
}
