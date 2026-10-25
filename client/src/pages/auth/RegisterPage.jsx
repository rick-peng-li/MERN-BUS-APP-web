import { Alert, Button, Card, Col, DatePicker, Divider, Form, Input, Radio, Row, Typography } from 'antd';
import { LockOutlined, MailOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { register } from '@/services/authService';
import { getErrorMessage } from '@/services/api';
import './auth.css';

const { Title, Paragraph, Text } = Typography;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async values => {
    setError('');
    setSubmitting(true);
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
        mobile: values.mobile,
        gender: values.gender,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : undefined
      });
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to create your account. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card" variant="borderless">
        <div className="auth-card__aside auth-card__aside--alt">
          <span className="auth-card__eyebrow">Join Unique Travels</span>
          <Title level={2} className="auth-card__title">
            Your next journey starts here
          </Title>
          <Paragraph className="auth-card__copy">
            Create a free account to book seats, review past trips and keep every ticket in one
            place.
          </Paragraph>
          <Divider className="auth-card__divider" />
          <Text className="auth-card__note">No booking fees. No hidden charges.</Text>
        </div>

        <div className="auth-card__form">
          <Title level={3}>Create your account</Title>
          <Paragraph type="secondary">
            It only takes a minute. Fields marked with an asterisk are required.
          </Paragraph>

          {error && <Alert type="error" showIcon className="auth-alert" description={error} />}

          <Form layout="vertical" requiredMark={false} onFinish={handleFinish}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="name"
                  label="Full name"
                  rules={[{ required: true, message: 'Please enter your name' }]}
                >
                  <Input size="large" prefix={<UserOutlined />} placeholder="Jane Doe" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                  <Input size="large" prefix={<MailOutlined />} placeholder="you@example.com" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="mobile"
                  label="Mobile number"
                  rules={[
                    { required: true, message: 'Please enter your mobile number' },
                    { pattern: /^[0-9+\-\s]{6,15}$/, message: 'Enter a valid mobile number' }
                  ]}
                >
                  <Input size="large" prefix={<MobileOutlined />} placeholder="9876543210" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="dob" label="Date of birth (optional)">
                  <DatePicker size="large" style={{ width: '100%' }} format="DD MMM YYYY" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[{ required: true, message: 'Please select a gender' }]}
                >
                  <Radio.Group options={['Male', 'Female', 'Other']} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please choose a password' },
                    { min: 6, message: 'Use at least 6 characters' }
                  ]}
                  hasFeedback
                >
                  <Input.Password size="large" prefix={<LockOutlined />} placeholder="At least 6 characters" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm password"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Please confirm your password' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords do not match'));
                      }
                    })
                  ]}
                >
                  <Input.Password size="large" prefix={<LockOutlined />} placeholder="Repeat your password" />
                </Form.Item>
              </Col>
            </Row>

            <Button
              type="primary"
              size="large"
              htmlType="submit"
              block
              loading={submitting}
              className="auth-submit"
            >
              Create account
            </Button>
          </Form>

          <Paragraph className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
}
