import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Row, Spin, Tag, Typography } from 'antd';
import { useBooking } from '@/context/BookingContext';
import { getBookedSeats } from '@/services/bookingService';
import { formatDate } from '@/utils/format';
import SeatMap from './SeatMap';
import PassengerDetails from './PassengerDetails';
import './booking.css';

const { Text, Title } = Typography;

export default function SeatSelectionStep({ onConfirm, onBack }) {
  const { draft, toggleSeat, updatePassenger } = useBooking();
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  const busId = draft.bus?._id;
  const travelDate = draft.travelDate;

  useEffect(() => {
    if (!busId) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    setLoading(true);
    setError('');

    getBookedSeats(busId, travelDate)
      .then(data => {
        if (active) {
          setBookedSeats(data.seats || []);
        }
      })
      .catch(() => {
        if (active) {
          setError('Unable to load seat availability. Please try again.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [busId, travelDate]);

  if (!draft.bus) {
    return (
      <Alert
        type="warning"
        showIcon
        description="Please select a bus before choosing your seats."
        action={
          <Button size="small" onClick={onBack}>
            Back to buses
          </Button>
        }
      />
    );
  }

  const handleConfirm = () => {
    if (draft.seats.length === 0) {
      setValidationError('Please select at least one seat.');
      return;
    }

    const missingPassengers = draft.seats.filter(
      seat => !draft.passengers.some(passenger => passenger.seat === seat)
    );
    const incomplete = draft.passengers.filter(
      passenger => !passenger.name.trim() || !passenger.gender
    );

    if (missingPassengers.length > 0 || incomplete.length > 0) {
      const seats = [...missingPassengers, ...incomplete.map(passenger => passenger.seat)];
      setValidationError(`Please add a passenger name and gender for seat ${[...new Set(seats)].join(', ')}.`);
      return;
    }

    setValidationError('');
    onConfirm();
  };

  return (
    <Card className="booking-panel" variant="borderless">
      <div className="booking-panel__heading">
        <div>
          <Title level={4} style={{ margin: 0 }}>
            {draft.bus.startCity} → {draft.bus.destination}
          </Title>
          <Text type="secondary">
            {draft.bus.companyName} · {draft.bus.busType} · {draft.bus.busNumber} ·{' '}
            {formatDate(draft.travelDate)}
          </Text>
        </div>
        <Tag color="purple">{draft.seats.length} seat(s) selected</Tag>
      </div>

      {error && <Alert type="error" showIcon className="step-alert" description={error} />}

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Spin spinning={loading} tip="Loading seat availability…">
            <SeatMap
              totalSeats={draft.bus.totalSeats}
              bookedSeats={bookedSeats}
              selectedSeats={draft.seats}
              onToggle={toggleSeat}
            />
          </Spin>
        </Col>
        <Col xs={24} lg={10}>
          <PassengerDetails passengers={draft.passengers} onChange={updatePassenger} />
          {validationError && (
            <Alert type="warning" showIcon className="step-alert" description={validationError} />
          )}
        </Col>
      </Row>

      <div className="booking-panel__actions">
        <Button onClick={onBack}>Back to buses</Button>
        <Button type="primary" size="large" onClick={handleConfirm}>
          Confirm seats
        </Button>
      </div>
    </Card>
  );
}
