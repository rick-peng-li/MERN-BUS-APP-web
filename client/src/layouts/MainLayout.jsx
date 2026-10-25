import { Dropdown, Grid, Layout, Menu, Space, Avatar, Button } from 'antd';
import {
  LogoutOutlined,
  MenuOutlined,
  ProfileOutlined,
  ScheduleOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from '@/components/common/BrandLogo';
import { useAuth } from '@/context/AuthContext';

const { Header, Content, Footer } = Layout;

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = Grid.useBreakpoint();
  const { user, isAuthenticated, signOut } = useAuth();

  const navItems = [
    { key: '/book', label: 'Book a trip' },
    ...(isAuthenticated ? [{ key: '/profile', label: 'My profile' }] : [])
  ];

  const mobileNavItems = navItems.map(item => ({
    key: item.key,
    label: item.label,
    icon: item.key === '/book' ? <ScheduleOutlined /> : <ProfileOutlined />
  }));

  const accountItems = [
    { key: 'profile', label: 'My profile', icon: <UserOutlined /> },
    { key: 'bookings', label: 'My bookings', icon: <ScheduleOutlined /> },
    { type: 'divider' },
    { key: 'signout', label: 'Sign out', icon: <LogoutOutlined />, danger: true }
  ];

  const handleAccountClick = ({ key }) => {
    if (key === 'signout') {
      signOut();
      navigate('/');
      return;
    }
    if (key === 'profile' || key === 'bookings') {
      navigate('/profile');
    }
  };

  const selectedKeys = navItems.some(item => item.key === location.pathname)
    ? [location.pathname]
    : [];

  return (
    <Layout className="app-shell">
      <Header className="app-header">
        <div className="app-header__inner">
          <BrandLogo />

          {screens.md ? (
            <Menu
              mode="horizontal"
              items={navItems}
              selectedKeys={selectedKeys}
              onClick={({ key }) => navigate(key)}
              className="app-nav"
            />
          ) : (
            <Dropdown
              menu={{ items: mobileNavItems, onClick: ({ key }) => navigate(key) }}
              trigger={['click']}
            >
              <Button type="text" icon={<MenuOutlined />} aria-label="Open navigation" />
            </Dropdown>
          )}

          <div className="app-header__actions">
            {isAuthenticated ? (
              <Dropdown menu={{ items: accountItems, onClick: handleAccountClick }} trigger={['click']}>
                <Button type="text" className="account-button">
                  <Space>
                    <Avatar size={32} className="account-avatar">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <span className="account-name">{user?.name || 'Traveller'}</span>
                  </Space>
                </Button>
              </Dropdown>
            ) : (
              <Space>
                <Link to="/login">
                  <Button type="text">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button type="primary">Create account</Button>
                </Link>
              </Space>
            )}
          </div>
        </div>
      </Header>

      <Content className="app-content">
        <Outlet />
      </Content>

      <Footer className="app-footer">
        <div className="app-footer__inner">
          <span>© {new Date().getFullYear()} Unique Travels. Travel uniquely, safely, with a smile.</span>
          <span className="app-footer__meta">Built with the MERN stack</span>
        </div>
      </Footer>
    </Layout>
  );
}
