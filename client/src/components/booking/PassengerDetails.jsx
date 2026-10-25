import { Empty, Input, Radio, Tag, Typography } from 'antd';
import { PASSENGER_GENDERS } from '@/utils/constants';
import './booking.css';

const { Text } = Typography;

export default function PassengerDetails({ passengers, onChange }) {
  if (!passengers.length) {
    return <Empty description="Pick a seat to add passenger details" />;
  }

  return (
    <div className="passenger-list">
      {passengers.map(passenger => (
        <div className="passenger-card" key={passenger.seat}>
          <div className="passenger-card__header">
            <Tag color="purple">Seat {passenger.seat}</Tag>
            <Text type="secondary">Passenger details</Text>
          </div>
          <Input
            size="large"
            placeholder="Full name as on ID"
            value={passenger.name}
            onChange={event => onChange(passenger.seat, { name: event.target.value })}
          />
          <Radio.Group
            className="passenger-card__gender"
            options={PASSENGER_GENDERS}
            value={passenger.gender}
            onChange={event => onChange(passenger.seat, { gender: event.target.value })}
          />
        </div>
      ))}
    </div>
  );
}
