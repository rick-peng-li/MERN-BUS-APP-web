import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Result
        status="404"
        title="Page not found"
        subTitle="The page you are looking for has either moved or never existed."
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            Back to home
          </Button>
        }
      />
    </div>
  );
}
