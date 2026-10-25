import { useState } from 'react';
import { Alert, Button, Card, Col, Form, Input, Result, Row, Space, Typography } from 'antd';
import { CreditCardOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useBooking } from '@/context/BookingContext';
import { createBooking } from '@/services/bookingService';
import { getErrorMessage } from '@/services/api';
import { formatCardNumber, formatCvc, formatExpiry, onlyDigits } from '@/utils/card';
import { formatCurrency } from '@/utils/format';
import { TAX_AMOUNT } from '@/utils/constants';
import BookingSummary from './BookingSummary';
import CardPreview from './CardPreview';
import './booking.css';

const { Text } = Typography;

const validateCardNumber = (_, value) => {
  if (!value) {
    return Promise.reject(new Error('Please enter your card number'));
  }
  return onlyDigits(value).length === 16
    ? Promise.resolve()
    : Promise.reject(new Error('Card number must contain 16 digits'));
};

const validateExpiry = (_, value) => {
  if (!value) {
    return Promise.reject(new Error('Please enter the expiry date'));
  }
  return /^(0[1-9]|1[0-2])\/\d{2}$/.test(value)
    ? Promise.resolve()
    : Promise.reject(new Error('Use the MM/YY format'));
};

export default function PaymentStep({ onBooked, onBack }) {
  const { draft } = useBooking();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const cardNumber = Form.useWatch('cardNumber', form) || '';
  const cardName = Form.useWatch('cardName', form) || '';
  const expiry = Form.useWatch('expiry', form) || '';

  if (!draft.bus || draft.seats.length === 0) {
    return (
      <Card className="booking-panel" variant="borderless">
        <Result
          status="warning"
          title="No seats selected"
          subTitle="Choose your seats and passenger details before checking out."
          extra={
            <Button type="primary" onClick={onBack}>
              Back to seats
            </Button>
          }
        />
      </Card>
    );
  }

  const total = draft.bus.pricePerSeat * draft.seats.length + TAX_AMOUNT;

  const handleFinish = async () => {
    setError('');
    setSubmitting(true);

    try {
      const { booking } = await createBooking({
        busId: draft.bus._id,
        travelDate: draft.travelDate,
        seats: draft.seats,
        passengers: draft.passengers.map(({ seat, name, gender }) => ({ seat, name, gender }))
      });
      onBooked(booking);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Payment failed. Please try again.'));
      setSubmitting(false);
    }
  };

  return (
    <div className="payment-grid">
      <Card className="booking-panel" variant="borderless">
        <CardPreview number={cardNumber} name={cardName} expiry={expiry} />

        <Text type="secondary" className="payment-note">
          <LockOutlined /> Demo checkout — no real card is charged.
        </Text>

        {error && <Alert type="error" showIcon className="step-alert" description={error} />}

        <Form form={form} layout="vertical" requiredMark={false} onFinish={handleFinish}>
          <Form.Item
            name="cardNumber"
            label="Card number"
            normalize={formatCardNumber}
            rules={[{ validator: validateCardNumber }]}
          >
            <Input
              size="large"
              prefix={<CreditCardOutlined />}
              placeholder="1234 5678 9012 3456"
              inputMode="numeric"
              maxLength={19}
            />
          </Form.Item>

          <Form.Item
            name="cardName"
            label="Cardholder name"
            rules={[
              { required: true, message: 'Please enter the cardholder name' },
              { min: 3, message: 'Name is too short' }
            ]}
          >
            <Input size="large" prefix={<UserOutlined />} placeholder="Name as printed on the card" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={12}>
              <Form.Item name="expiry" label="Expiry" normalize={formatExpiry} rules={[{ validator: validateExpiry }]}>
                <Input size="large" placeholder="MM/YY" inputMode="numeric" maxLength={5} />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item
                name="cvc"
                label="CVC"
                normalize={formatCvc}
                rules={[
                  { required: true, message: 'Please enter the CVC' },
                  { pattern: /^\d{3,4}$/, message: 'CVC must be 3 or 4 digits' }
                ]}
              >
                <Input size="large" placeholder="123" inputMode="numeric" maxLength={4} />
              </Form.Item>
            </Col>
          </Row>

          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              block
              loading={submitting}
              icon={<LockOutlined />}
            >
              Pay {formatCurrency(total)}
            </Button>
            <Button block onClick={onBack} disabled={submitting}>
              Back to seats
            </Button>
          </Space>
        </Form>
      </Card>

      <div>
        <BookingSummary
          bus={draft.bus}
          travelDate={draft.travelDate}
          seats={draft.seats}
          passengers={draft.passengers}
        />
      </div>
    </div>
  );
}
