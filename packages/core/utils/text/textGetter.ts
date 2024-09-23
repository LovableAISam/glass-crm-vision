
const getterString = (text: string | null | undefined): string => {
  if (!text) {
    return '';
  }
  return text;
}

const getterNumber = (text: number | null | undefined): number => {
  if (!text) {
    return 0;
  }
  return text;
}

export default {
  getterString,
  getterNumber
}