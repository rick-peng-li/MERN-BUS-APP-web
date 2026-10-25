import { Alert, Button, Card, Divider, Form, Input, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/services/api';
import './auth.css';

const { Title, Paragraph, Text } = Typography;

const DEMO_CREDENTIALS = {
  email: 'demo@uniquetravels.com',
  password: 'demo1234'
};

export default function LoginPage() {
  const [form] = Form.useForm();
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || '/book';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleFinish = async values => {
    setError('');
    setSubmitting(true);
    try {
      await signIn(values);
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to sign in. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card" variant="borderless">
        <div className="auth-card__aside">
          <span className="auth-card__eyebrow">Unique Travels</span>
          <Title level={2} className="auth-card__title">
            Welcome back
          </Title>
          <Paragraph className="auth-card__copy">
            Sign in to search live schedules, reserve your favourite seat and pick up where your
            last journey left off.
          </Paragraph>
          <Divider className="auth-card__divider" />
          <Text className="auth-card__note">One account. Every route. Every ticket.</Text>
        </div>

        <div className="auth-card__form">
          <Title level={3}>Sign in</Title>
          <Paragraph type="secondary">Use your email and password to continue.</Paragraph>

          {location.state?.registered && (
            <Alert
              type="success"
              showIcon
              className="auth-alert"
              description="Your account is ready. Sign in to start booking."
            />
          )}

          {error && (
            <Alert type="error" showIcon className="auth-alert" description={error} />
          )}

          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleFinish}
            initialValues={{ email: '', password: '' }}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email address' }
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Your password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Button
              type="primary"
              size="large"
              htmlType="submit"
              block
              loading={submitting}
              className="auth-submit"
            >
              Sign in
            </Button>
          </Form>

          <Alert
            className="auth-demo"
            type="info"
            showIcon
            description={
              <div className="auth-demo__content">
                <div>
                  <strong>Demo account</strong>
                  <div>
                    {DEMO_CREDENTIALS.email} · {DEMO_CREDENTIALS.password}
                  </div>
                </div>
                <Button size="small" onClick={() => form.setFieldsValue(DEMO_CREDENTIALS)}>
                  Fill in
                </Button>
              </div>
            }
          />

          <Paragraph className="auth-switch">
            New to Unique Travels? <Link to="/register">Create an account</Link>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
}
