import { Card, Divider, Tag, Typography } from 'antd';
import { formatCurrency, formatDate, pluralize } from '@/utils/format';
import { TAX_AMOUNT } from '@/utils/constants';
import './booking.css';

const { Text, Title } = Typography;

export default function BookingSummary({ bus, travelDate, seats, passengers }) {
  if (!bus) {
    return null;
  }

  const subtotal = bus.pricePerSeat * seats.length;
  const total = subtotal + TAX_AMOUNT;

  return (
    <Card className="summary-card" variant="borderless">
      <Text type="secondary">Your trip</Text>
      <Title level={4} className="summary-card__route">
        {bus.startCity} → {bus.destination}
      </Title>
      <Text type="secondary">
        {bus.companyName} · {bus.busType} · {bus.busNumber}
      </Text>

      <Divider />

      <div className="summary-row">
        <span>Travel date</span>
        <strong>{formatDate(travelDate)}</strong>
      </div>
      <div className="summary-row">
        <span>Seats</span>
        <span className="summary-tags">
          {seats.map(seat => (
            <Tag key={seat}>{seat}</Tag>
          ))}
        </span>
      </div>
      <div className="summary-row">
        <span>Passengers</span>
        <strong>{passengers.length}</strong>
      </div>

      <Divider />

      <div className="summary-row">
        <span>
          {pluralize(seats.length, 'seat')} × {formatCurrency(bus.pricePerSeat)}
        </span>
        <strong>{formatCurrency(subtotal)}</strong>
      </div>
      <div className="summary-row">
        <span>Taxes &amp; fees</span>
        <strong>{formatCurrency(TAX_AMOUNT)}</strong>
      </div>

      <div className="summary-row summary-row--total">
        <span>Total payable</span>
        <strong>{formatCurrency(total)}</strong>
      </div>
    </Card>
  );
}
