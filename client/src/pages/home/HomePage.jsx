import { Button, Card, Col, Row, Space, Steps, Tag, Typography } from 'antd';
import {
  ArrowRightOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import heroImage from '@/assets/hero.jpg';
import './HomePage.css';

const { Title, Paragraph, Text } = Typography;

const features = [
  {
    icon: <ThunderboltOutlined />,
    title: 'Live seat availability',
    description: 'See exactly which seats are free for your travel date before you commit.'
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: 'Secure checkout',
    description: 'A single, protected booking flow with an instant e-ticket and transaction ID.'
  },
  {
    icon: <ClockCircleOutlined />,
    title: 'Travellers on 20+ routes',
    description: 'AC sleepers, multi-axle coaches and everyday seaters across South India.'
  }
];

const popularRoutes = [
  { from: 'Chennai', to: 'Bangalore', price: 950 },
  { from: 'Bangalore', to: 'Hyderabad', price: 1200 },
  { from: 'Kochi', to: 'Chennai', price: 1300 },
  { from: 'Coimbatore', to: 'Chennai', price: 700 }
];

const steps = [
  { title: 'Search the route', content: 'Pick your cities and travel date.' },
  { title: 'Choose your seats', content: 'Pick seats and add passenger names.' },
  { title: 'Pay and travel', content: 'Checkout and download your e-ticket.' }
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const primaryTarget = isAuthenticated ? '/book' : '/register';

  return (
    <div className="home">
      <section className="home-hero">
        <div
          className="home-hero__image"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden="true"
        />
        <div className="home-hero__overlay" />

        <div className="home-hero__content">
          <Tag color="rgba(255,255,255,0.16)" className="home-hero__tag">
            Travel uniquely, safely, with a smile
          </Tag>
          <Title className="home-hero__title">
            Intercity bus tickets,
            <br />
            booked in under a minute.
          </Title>
          <Paragraph className="home-hero__subtitle">
            Search live schedules, choose the seat you like and receive a digital ticket —
            all from one place.
          </Paragraph>
          <Space size="middle" wrap>
            <Link to={primaryTarget}>
              <Button type="primary" size="large" className="home-cta">
                Get started <ArrowRightOutlined />
              </Button>
            </Link>
            <Link to={isAuthenticated ? '/profile' : '/login'}>
              <Button size="large" className="home-cta home-cta--ghost">
                {isAuthenticated ? 'My bookings' : 'Sign in'}
              </Button>
            </Link>
          </Space>
        </div>

        <div className="home-hero__stats">
          <div>
            <strong>22</strong>
            <span>daily services</span>
          </div>
          <div>
            <strong>36</strong>
            <span>seats per coach</span>
          </div>
          <div>
            <strong>8</strong>
            <span>cities connected</span>
          </div>
        </div>
      </section>

      <section className="home-section">
        <Row gutter={[24, 24]}>
          {features.map(feature => (
            <Col xs={24} md={8} key={feature.title}>
              <Card className="feature-card" variant="borderless">
                <span className="feature-card__icon">{feature.icon}</span>
                <Title level={4}>{feature.title}</Title>
                <Paragraph type="secondary">{feature.description}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="home-section">
        <div className="home-section__heading">
          <div>
            <Title level={2}>Popular routes</Title>
            <Paragraph type="secondary">
              A snapshot of the busiest connections in our network. Fares shown are one way.
            </Paragraph>
          </div>
          <Link to="/book" className="home-link">
            Book a trip <ArrowRightOutlined />
          </Link>
        </div>

        <Row gutter={[24, 24]}>
          {popularRoutes.map(route => (
            <Col xs={24} sm={12} lg={6} key={`${route.from}-${route.to}`}>
              <Card className="route-card" variant="borderless">
                <Text type="secondary">From</Text>
                <Title level={4}>{route.from}</Title>
                <Text type="secondary">To</Text>
                <Title level={4}>{route.to}</Title>
                <div className="route-card__footer">
                  <Text strong>from ₹{route.price}</Text>
                  <Link to="/book">
                    <Button type="link" size="small">
                      Select
                    </Button>
                  </Link>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="home-section home-section--steps">
        <Card className="steps-card" variant="borderless">
          <Title level={2}>How booking works</Title>
          <Steps items={steps} />
        </Card>
      </section>
    </div>
  );
}
