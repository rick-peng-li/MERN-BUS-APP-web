import { useState } from 'react';
import { Alert, Button, Card, Steps, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { getCities, searchBuses } from '@/services/bookingService';
import { getErrorMessage } from '@/services/api';
import useRequest from '@/hooks/useRequest';
import RouteSearch from '@/components/booking/RouteSearch';
import BusList from '@/components/booking/BusList';
import SeatSelectionStep from '@/components/booking/SeatSelectionStep';
import PaymentStep from '@/components/booking/PaymentStep';
import './BookingPage.css';

const { Title, Paragraph, Text } = Typography;

const steps = [
  { title: 'Select bus', content: 'Search your route' },
  { title: 'Seats & passengers', content: 'Pick seats, add names' },
  { title: 'Payment', content: 'Checkout securely' }
];

export default function BookingPage() {
  const navigate = useNavigate();
  const { draft, updateTrip, selectBus, clearBus, clearBooking } = useBooking();
  const { data: citiesData, error: citiesError } = useRequest(getCities, {
    errorMessage: 'Unable to load the city list. Please refresh the page.'
  });
  const cities = citiesData || { startCities: [], destinations: [] };
  const [buses, setBuses] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(() => {
    if (!draft.bus) {
      return 0;
    }
    return draft.seats.length > 0 ? 2 : 1;
  });

  const handleSearch = async values => {
    setError('');
    setSearching(true);
    try {
      const result = await searchBuses(values);
      updateTrip({
        startCity: values.startCity,
        destination: values.destination,
        travelDate: values.travelDate
      });
      clearBus();
      setBuses(result.buses || []);
      setSearched(true);
      if (!result.buses || result.buses.length === 0) {
        setError('No buses found for this route and date. Try another date.');
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to search buses. Please try again.'));
    } finally {
      setSearching(false);
    }
  };

  const handleSelectBus = bus => {
    selectBus(bus);
    setStep(1);
  };

  const handleStartOver = () => {
    clearBus();
    setBuses([]);
    setSearched(false);
    setError('');
    setStep(0);
  };

  const handleBooked = booking => {
    clearBooking();
    navigate(`/ticket/${booking.transactionId}`, {
      replace: true,
      state: { justBooked: true }
    });
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <Title level={2}>Book your journey</Title>
          <Paragraph type="secondary">
            Search a route, pick your seats and pay — your e-ticket is issued instantly.
          </Paragraph>
        </div>
        {draft.bus && step > 0 && <Tag color="purple">Trip in progress</Tag>}
      </div>

      <Card className="booking-steps" variant="borderless">
        <Steps current={step} items={steps} />
      </Card>

      {step === 0 && (
        <>
          <RouteSearch
            cities={cities}
            loading={searching}
            initialValues={draft}
            onSearch={handleSearch}
          />

          {(error || citiesError) && (
            <Alert type="warning" showIcon className="step-alert" description={error || citiesError} />
          )}

          {draft.bus && searched && (
            <Alert
              type="info"
              showIcon
              className="step-alert"
              description={`${draft.bus.companyName} (${draft.bus.startCity} → ${draft.bus.destination}) is selected.`}
              action={
                <Button size="small" type="primary" onClick={() => setStep(1)}>
                  Continue
                </Button>
              }
            />
          )}

          <BusList buses={buses} onSelect={handleSelectBus} />
        </>
      )}

      {step === 1 && (
        <SeatSelectionStep onConfirm={() => setStep(2)} onBack={() => setStep(0)} />
      )}

      {step === 2 && (
        <PaymentStep onBooked={handleBooked} onBack={() => setStep(1)} />
      )}

      {step > 0 && (
        <div className="booking-footer-note">
          <Text type="secondary">
            Need a different bus?{' '}
            <Button type="link" size="small" onClick={handleStartOver} style={{ padding: 0 }}>
              Start over
            </Button>
          </Text>
        </div>
      )}
    </div>
  );
}
