import { Link } from 'react-router-dom';
import { CarOutlined } from '@ant-design/icons';

export default function BrandLogo({ compact = false }) {
  return (
    <Link to="/" className="brand-logo" aria-label="Unique Travels home">
      <span className="brand-logo__mark">
        <CarOutlined />
      </span>
      {!compact && (
        <span className="brand-logo__text">
          <strong>Unique Travels</strong>
          <small>Intercity bus booking</small>
        </span>
      )}
    </Link>
  );
}
