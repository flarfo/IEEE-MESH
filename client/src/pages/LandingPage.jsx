// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import { Layout, Typography, Space, Divider, Row, Col } from 'antd';
import {
  DatabaseOutlined,
  UserAddOutlined,
  DashboardOutlined,
  LogoutOutlined,
  LoginOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import AnimatedBackground from '../components/AnimatedBackground';

const { Content, Footer } = Layout;
const { Paragraph } = Typography;

const LandingPage = () => {
  const { status, username } = useAuth();

  const [sendLogout, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useSendLogoutMutation();

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-xl font-semibold text-gray-700">Logging Out...</div>
    </div>
  );

  if (isError) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-xl font-semibold text-red-600">Error: {error.data?.message}</div>
    </div>
  );

  // Define cards based on user status
  const getCards = () => {
    const cards = [];

    if (status !== '') {
      cards.push({
        title: 'Database',
        icon: <DatabaseOutlined className="text-4xl mb-4 text-white" />,
        description: 'Access the member database',
        link: '/database/members',
      });

      cards.push({
        title: 'Profile',
        icon: <ProfileOutlined className="text-4xl mb-4 text-white" />,
        description: `View your profile details`,
        link: `/profile/${username}`,
      });
    }

    if (status === 'Admin') {
      cards.push({
        title: 'Admin Dashboard',
        icon: <DashboardOutlined className="text-4xl mb-4 text-white" />,
        description: 'Manage system settings and users',
        link: '/dash',
      });
    }

    if (status === '') {
      cards.push({
        title: 'Register',
        icon: <UserAddOutlined className="text-4xl mb-4 text-white" />,
        description: 'Create a new account',
        link: '/register',
      });

      cards.push({
        title: 'Login',
        icon: <LoginOutlined className="text-4xl mb-4 text-white" />,
        description: 'Access your account',
        link: '/login',
      });
    }

    if (status !== '') {
      cards.push({
        title: 'Logout',
        icon: <LogoutOutlined className="text-4xl mb-4 text-white" />,
        description: 'Sign out from your account',
        onClick: sendLogout,
      });
    }

    return cards;
  };

  return (
    <Layout className="bg-transparent">
      <AnimatedBackground />
      <Content className='pt-8 px-4 sm:px-8 bg-transparent'>
        <div className='max-w-5xl mx-auto flex flex-col items-center justify-center'>
          <img
            src='/images/MESH.svg'
            alt='MESH Logo'
            className='w-64 md:w-80'
          />
        </div>
      </Content>

      <Content className='px-4 sm:px-8 md:px-16 py-8 bg-transparent'>
        <div className='max-w-5xl mx-auto'>
          <Row gutter={[16, 16]} justify="center">
            {getCards().map((card, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                {card.onClick ? (
                  <div
                    onClick={card.onClick}
                    className={`rounded-lg p-6 text-center h-full cursor-pointer
                      transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                      flex flex-col items-center justify-center border border-gray-500 
                      shadow-lg backdrop-filter backdrop-blur-sm bg-black bg-opacity-50`}
                  >
                    {card.icon}
                    <Paragraph className="text-white m-0">{card.description}</Paragraph>
                  </div>
                ) : (
                  <Link to={card.link}>
                    <div
                      className={`rounded-lg p-6 text-center h-full
                        transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                        flex flex-col items-center justify-center border border-gray-500 
                        shadow-lg backdrop-filter backdrop-blur-sm bg-black bg-opacity-50`}
                    >
                      {card.icon}
                      <Paragraph className="text-white m-0">{card.description}</Paragraph>
                    </div>
                  </Link>
                )}
              </Col>
            ))}
          </Row>
        </div>
      </Content>

      <Footer className="text-white py-6 bg-transparent mt-auto">
        <div className='max-w-5xl mx-auto'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='mb-2 md:mb-0'>
              <img
                src='/images/MESH.svg'
                alt='MESH Logo'
                className='h-6 mb-2'
              />
              <span className="text-gray-400 text-sm">©2025 IEEE MESH - All rights reserved.</span>
            </div>
            <div>
              <Space split={<Divider type='vertical' style={{ borderColor: '#666' }} />}>
                <Link to='#' className='text-gray-400 hover:text-white transition-colors'>About us</Link>
                <Link to='#' className='text-gray-400 hover:text-white transition-colors'>Privacy</Link>
                <Link to='#' className='text-gray-400 hover:text-white transition-colors'>Contact</Link>
              </Space>
            </div>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default LandingPage;