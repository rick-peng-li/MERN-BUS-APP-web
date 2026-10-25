import dayjs from 'dayjs';
import { CURRENCY_SYMBOL, READABLE_DATE_FORMAT } from './constants';

export const formatCurrency = value => `${CURRENCY_SYMBOL}${Number(value || 0).toLocaleString('en-IN')}`;

export const formatDate = (value, fallback = '—') => {
  if (!value) {
    return fallback;
  }
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format(READABLE_DATE_FORMAT) : fallback;
};

export const pluralize = (count, singular, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;
