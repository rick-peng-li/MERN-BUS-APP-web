import { detectCardBrand } from '@/utils/card';
import './CardPreview.css';

export default function CardPreview({ number, name, expiry }) {
  const brand = detectCardBrand(number);

  return (
    <div className="card-preview">
      <div className="card-preview__top">
        <span className="card-preview__brand">{brand}</span>
        <span className="card-preview__chip" />
      </div>
      <div className="card-preview__number">{number || '•••• •••• •••• ••••'}</div>
      <div className="card-preview__bottom">
        <div>
          <small>Cardholder</small>
          <span>{name ? name.toUpperCase() : 'YOUR NAME'}</span>
        </div>
        <div>
          <small>Expires</small>
          <span>{expiry || 'MM/YY'}</span>
        </div>
      </div>
    </div>
  );
}
