import { Button, Card, Col, DatePicker, Form, Row, Select, Space } from 'antd';
import { SearchOutlined, SwapOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '@/utils/constants';
import './booking.css';

export default function RouteSearch({ cities, initialValues, loading, onSearch }) {
  const [form] = Form.useForm();

  const handleSwap = () => {
    const { startCity, destination } = form.getFieldsValue();
    form.setFieldsValue({ startCity: destination, destination: startCity });
  };

  const handleFinish = values => {
    onSearch({
      startCity: values.startCity,
      destination: values.destination,
      travelDate: values.travelDate.format(DATE_FORMAT)
    });
  };

  return (
    <Card className="search-card" variant="borderless">
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        initialValues={{
          startCity: initialValues.startCity || undefined,
          destination: initialValues.destination || undefined,
          travelDate: initialValues.travelDate ? dayjs(initialValues.travelDate) : dayjs()
        }}
      >
        <Row gutter={[16, 0]} align="bottom">
          <Col xs={24} md={7}>
            <Form.Item
              name="startCity"
              label="From"
              rules={[{ required: true, message: 'Choose your starting city' }]}
            >
              <Select
                size="large"
                placeholder="Starting city"
                showSearch
                optionFilterProp="label"
                options={cities.startCities.map(city => ({ value: city, label: city }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={2} className="search-swap">
            <Button
              type="text"
              shape="circle"
              icon={<SwapOutlined rotate={90} />}
              onClick={handleSwap}
              aria-label="Swap cities"
            />
          </Col>

          <Col xs={24} md={7}>
            <Form.Item
              name="destination"
              label="To"
              rules={[{ required: true, message: 'Choose your destination' }]}
            >
              <Select
                size="large"
                placeholder="Destination"
                showSearch
                optionFilterProp="label"
                options={cities.destinations.map(city => ({ value: city, label: city }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={4}>
            <Form.Item
              name="travelDate"
              label="Travel date"
              rules={[{ required: true, message: 'Choose a travel date' }]}
            >
              <DatePicker size="large" style={{ width: '100%' }} format="DD MMM" />
            </Form.Item>
          </Col>

          <Col xs={24} md={4}>
            <Form.Item label=" ">
              <Space.Compact style={{ width: '100%' }}>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  loading={loading}
                  block
                >
                  Search
                </Button>
              </Space.Compact>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
