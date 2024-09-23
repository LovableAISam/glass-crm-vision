
export const DEFAULT_NUMBER_FORMAT_OPTION = {
  minimumFractionDigits: 2,
};

export const formatPrice = (amount: string | number, locale?: string) => new Intl.NumberFormat(
  locale,
  { ...DEFAULT_NUMBER_FORMAT_OPTION }
).format(Number(amount));

export default {
  formatPrice,
};
