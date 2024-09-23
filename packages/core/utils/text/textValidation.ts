

function minChar(str: string, threshold: number) {
  return str.length >= threshold;
};

function maxChar(str: string, threshold: number) {
  return str.length <= threshold;
};

function containsUppercase(str: string) {
  const text = /(?=.*[A-Z]).+$/;
  return text.test(str);
};

function containsSpecialChars(str: string) {
  const text = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return text.test(str);
}

function containsNumber(str: string) {
  const text = /[0-9]/i;
  return text.test(str);
}

function isEmailFormat(str: string) {
  const text = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return text.test(str);
}

export default {
  minChar,
  maxChar,
  containsUppercase,
  containsSpecialChars,
  containsNumber,
  isEmailFormat,
}