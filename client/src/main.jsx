import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import App from '@/App';
import { AuthProvider } from '@/context/AuthContext';
import { BookingProvider } from '@/context/BookingContext';
import '@/styles/global.css';

const theme = {
  token: {
    colorPrimary: '#5b4bff',
    colorInfo: '#5b4bff',
    colorLink: '#5b4bff',
    borderRadius: 12,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    colorBgLayout: '#f6f7fb',
    colorTextHeading: '#141a33',
    boxShadowSecondary: '0 18px 45px rgba(20, 26, 51, 0.12)'
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#f6f7fb',
      footerBg: '#141a33'
    },
    Card: {
      borderRadiusLG: 18
    },
    Button: {
      controlHeightLG: 46,
      fontWeight: 600
    }
  }
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <BookingProvider>
            <App />
          </BookingProvider>
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>
);
