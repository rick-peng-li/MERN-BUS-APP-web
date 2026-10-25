export const onlyDigits = value => String(value || '').replace(/\D/g, '');

export const formatCardNumber = value =>
  onlyDigits(value).slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

export const formatExpiry = value => {
  const digits = onlyDigits(value).slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export const formatCvc = value => onlyDigits(value).slice(0, 4);

export const detectCardBrand = value => {
  const digits = onlyDigits(value);
  if (/^4/.test(digits)) {
    return 'Visa';
  }
  if (/^(5[1-5]|2[2-7])/.test(digits)) {
    return 'Mastercard';
  }
  if (/^3[47]/.test(digits)) {
    return 'Amex';
  }
  if (/^6/.test(digits)) {
    return 'Discover';
  }
  return 'Card';
};
