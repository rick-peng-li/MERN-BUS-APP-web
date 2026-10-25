import { Button, Card, Col, Empty, Row, Space, Tag, Typography } from 'antd';
import { ArrowRightOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { formatCurrency } from '@/utils/format';
import './booking.css';

const { Text } = Typography;

export default function BusList({ buses, onSelect }) {
  if (!buses.length) {
    return (
      <Card className="bus-empty" variant="borderless">
        <Empty description="Search a route above to see the available buses" />
      </Card>
    );
  }

  return (
    <Row gutter={[16, 16]} className="bus-list">
      {buses.map(bus => (
        <Col xs={24} key={bus._id}>
          <Card className="bus-card" variant="borderless">
            <Row align="middle" gutter={[16, 16]}>
              <Col xs={24} md={9}>
                <Space direction="vertical" size={2}>
                  <Space size={8} wrap>
                    <Text strong className="bus-card__company">
                      {bus.companyName}
                    </Text>
                    <Tag color="geekblue">{bus.busType}</Tag>
                  </Space>
                  <Text type="secondary">{bus.busNumber}</Text>
                  <Text type="secondary">
                    <EnvironmentOutlined /> {bus.startCity} <ArrowRightOutlined /> {bus.destination}
                  </Text>
                </Space>
              </Col>

              <Col xs={12} md={4}>
                <Text type="secondary">Seats left</Text>
                <div className="bus-card__value">
                  {bus.availableSeats}
                  <span> / {bus.totalSeats}</span>
                </div>
              </Col>

              <Col xs={12} md={4}>
                <Text type="secondary">Fare per seat</Text>
                <div className="bus-card__value">{formatCurrency(bus.pricePerSeat)}</div>
              </Col>

              <Col xs={24} md={7} className="bus-card__action">
                <Button type="primary" size="large" onClick={() => onSelect(bus)}>
                  Select seats
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
