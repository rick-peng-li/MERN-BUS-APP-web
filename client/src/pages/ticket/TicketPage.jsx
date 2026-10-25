import { Button, Card, Col, Divider, Result, Row, Space, Spin, Tag, Typography } from 'antd';
import { ArrowRightOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { getTicket } from '@/services/bookingService';
import useRequest from '@/hooks/useRequest';
import { formatCurrency, formatDate } from '@/utils/format';
import './TicketPage.css';

const { Text, Title } = Typography;

export default function TicketPage() {
  const { transactionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { data, loading, error } = useRequest(() => getTicket(transactionId), {
    errorMessage: 'Unable to load this ticket.',
    deps: [transactionId]
  });

  const booking = data?.booking || null;

  if (loading) {
    return (
      <div className="page-container ticket-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="page-container">
        <Result
          status="warning"
          title="Ticket unavailable"
          subTitle={error || 'We could not find this ticket.'}
          extra={[
            <Button key="book" type="primary" onClick={() => navigate('/book')}>
              Book a trip
            </Button>,
            <Button key="profile" onClick={() => navigate('/profile')}>
              My bookings
            </Button>
          ]}
        />
      </div>
    );
  }

  const bus = booking.bus || {};

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <Title level={2}>Your e-ticket</Title>
          <span className="ticket-subheading">Keep this page handy when you board.</span>
        </div>
        <Tag color="green">Confirmed</Tag>
      </div>

      {location.state?.justBooked && (
        <div className="ticket-alert ticket-success">
          Payment successful — your seat is confirmed and the ticket is ready.
        </div>
      )}

      <Card className="ticket-card" variant="borderless">
        <header className="ticket-head">
          <div>
            <span className="ticket-head__brand">Unique Travels</span>
            <Title level={3} className="ticket-head__route">
              {bus.startCity} <ArrowRightOutlined /> {bus.destination}
            </Title>
            <Text className="ticket-head__meta">
              <EnvironmentOutlined /> {bus.companyName} · {bus.busType} · {bus.busNumber}
            </Text>
          </div>
          <div className="ticket-head__date">
            <small>Travel date</small>
            <strong>{formatDate(booking.travelDate)}</strong>
          </div>
        </header>

        <Divider className="ticket-divider" dashed>
          <span className="ticket-divider__label">BOARDING PASS</span>
        </Divider>

        <Row gutter={[24, 24]} className="ticket-body">
          <Col xs={12} md={6}>
            <span className="ticket-label">Seats</span>
            <div className="ticket-seats">
              {booking.seats.map(seat => (
                <Tag key={seat} color="purple">
                  {seat}
                </Tag>
              ))}
            </div>
          </Col>
          <Col xs={12} md={6}>
            <span className="ticket-label">Passengers</span>
            <strong className="ticket-value">{booking.passengers.length}</strong>
          </Col>
          <Col xs={12} md={6}>
            <span className="ticket-label">Amount paid</span>
            <strong className="ticket-value">{formatCurrency(booking.totalAmount)}</strong>
          </Col>
          <Col xs={12} md={6}>
            <span className="ticket-label">Status</span>
            <strong className="ticket-value ticket-value--status">Confirmed</strong>
          </Col>
        </Row>

        <Divider />

        <div className="ticket-passengers">
          <span className="ticket-label">Passenger names</span>
          <Row gutter={[16, 12]}>
            {booking.passengers.map(passenger => (
              <Col xs={24} sm={12} md={8} key={passenger.seat}>
                <div className="ticket-passenger">
                  <Tag>{passenger.seat}</Tag>
                  <div>
                    <strong>{passenger.name}</strong>
                    <span>{passenger.gender}</span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <footer className="ticket-footer">
          <div>
            <small>Transaction ID</small>
            <strong className="ticket-txn">{booking.transactionId}</strong>
          </div>
          <Space wrap>
            <Button onClick={() => navigate('/book')}>Book another trip</Button>
            <Button type="primary" onClick={() => navigate('/profile')}>
              View my bookings
            </Button>
          </Space>
        </footer>
      </Card>
    </div>
  );
}
