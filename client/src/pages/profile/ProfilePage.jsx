import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography
} from 'antd';
import { MailOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getMyBookings, getProfile } from '@/services/authService';
import useRequest from '@/hooks/useRequest';
import { formatCurrency, formatDate } from '@/utils/format';
import './ProfilePage.css';

const { Title, Text } = Typography;

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: cachedUser } = useAuth();

  const { data, loading, error } = useRequest(
    () => Promise.all([getProfile(), getMyBookings()]),
    { errorMessage: 'Unable to load your profile.' }
  );

  const [profileData, bookingData] = data || [];
  const user = profileData?.user || cachedUser;
  const bookings = bookingData?.bookings || [];
  const stats = profileData?.stats || { totalBookings: 0, totalSeats: 0, totalSpent: 0 };

  const columns = [
    {
      title: 'Transaction',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: value => <span className="profile-txn">{value}</span>
    },
    {
      title: 'Route',
      key: 'route',
      render: (_, booking) =>
        booking.bus ? `${booking.bus.startCity} → ${booking.bus.destination}` : '—'
    },
    {
      title: 'Travel date',
      dataIndex: 'travelDate',
      key: 'travelDate',
      render: value => formatDate(value)
    },
    {
      title: 'Seats',
      dataIndex: 'seats',
      key: 'seats',
      render: seats => (
        <div className="profile-seats">
          {seats.map(seat => (
            <Tag key={seat}>{seat}</Tag>
          ))}
        </div>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: value => formatCurrency(value)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => <Tag color={status === 'cancelled' ? 'red' : 'green'}>{status}</Tag>
    },
    {
      title: '',
      key: 'action',
      render: (_, booking) => (
        <Button type="link" onClick={() => navigate(`/ticket/${booking.transactionId}`)}>
          View ticket
        </Button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="page-container profile-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <Title level={2}>My profile</Title>
          <Text type="secondary">Your account details and travel history.</Text>
        </div>
        <Button type="primary" onClick={() => navigate('/book')}>
          Book a new trip
        </Button>
      </div>

      {error && <div className="profile-error">{error}</div>}

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={9}>
          <Card className="profile-card" variant="borderless">
            <div className="profile-card__identity">
              <Avatar size={72} icon={<UserOutlined />} className="profile-avatar" />
              <div>
                <Title level={3} className="profile-name">
                  {user?.name || 'Traveller'}
                </Title>
                <Text type="secondary">Member of Unique Travels</Text>
              </div>
            </div>

            <div className="profile-details">
              <div>
                <MailOutlined />
                <span>{user?.email || '—'}</span>
              </div>
              <div>
                <MobileOutlined />
                <span>{user?.mobile || '—'}</span>
              </div>
              <div>
                <UserOutlined />
                <span>{user?.gender || '—'}</span>
              </div>
            </div>

            <div className="profile-dob">
              <Text type="secondary">Date of birth</Text>
              <br />
              <Text strong>{user?.dob ? formatDate(user.dob, 'Not provided') : 'Not provided'}</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={15}>
          <Row gutter={[16, 16]} className="profile-stats">
            <Col xs={24} sm={8}>
              <Card className="stat-card" variant="borderless">
                <Statistic title="Trips booked" value={stats.totalBookings} />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="stat-card" variant="borderless">
                <Statistic title="Seats reserved" value={stats.totalSeats} />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="stat-card" variant="borderless">
                <Statistic title="Total spent" value={stats.totalSpent} prefix="₹" />
              </Card>
            </Col>
          </Row>

          <Card className="profile-bookings" variant="borderless" title="Booking history">
            <Table
              rowKey="_id"
              columns={columns}
              dataSource={bookings}
              pagination={{ pageSize: 5, hideOnSinglePage: true }}
              scroll={{ x: 780 }}
              locale={{
                emptyText: (
                  <Empty description="You have not booked a trip yet">
                    <Button type="primary" onClick={() => navigate('/book')}>
                      Book your first trip
                    </Button>
                  </Empty>
                )
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
