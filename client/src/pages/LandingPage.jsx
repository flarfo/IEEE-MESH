import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import { Layout, Typography, Button, Space, Divider } from 'antd';
import { DatabaseOutlined, UserAddOutlined, DashboardOutlined, LogoutOutlined, LoginOutlined, ProfileOutlined } from '@ant-design/icons';
const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const LandingPage = () => {
    const { status, username } = useAuth();

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation();

    if (isLoading) return <p>Logging Out...</p>;
    if (isError) return <p>Error: {error.data?.message}</p>

    return (
        <Layout className='min-h-screen'>
            <Content className='px-4 sm:px-8 md:px-16'>
                <div className='max-w-4xl mx-auto text-center py-16 md:py-24'>
                    {/* Hero Section */}
                    <Title level={1} style={{ fontSize: '3rem', marginBottom: '2rem' }}>
                        IEEE MESH
                    </Title>

                    <Paragraph className='text-lg md:text-xl mb-12' style={{ maxWidth: '800px', margin: '0 auto 3rem' }}>
                        An effort to increase new student retention and maintain alumni connections
                        by creating accessible, centralized profiles of academic and professional involvements.
                    </Paragraph>

                    <Space direction='vertical' size='large' className='w-full'>
                        {status !== '' && <Link to='/database/members'>
                            <Button
                                type='primary'
                                size='large'
                                icon={<DatabaseOutlined />}
                                style={{
                                    height: 'auto',
                                    padding: '1.2rem 2.5rem',
                                    fontSize: '1.2rem',
                                    width: '280px',
                                    backgroundColor: 'black'
                                }}
                            >
                                View Database
                            </Button>
                        </Link>}

                        {status !== '' && <Link to={`/profile/${username}`}>
                            <Button
                                type='primary'
                                size='large'
                                icon={<ProfileOutlined />}
                                style={{
                                    height: 'auto',
                                    padding: '1.2rem 2.5rem',
                                    fontSize: '1.2rem',
                                    width: '280px',
                                    backgroundColor: 'black'
                                }}
                            >
                                View Profile
                            </Button>
                        </Link>}

                        {status === 'Admin' && <Link to='/dash'>
                            <Button
                                type='primary'
                                size='large'
                                icon={<DashboardOutlined />}
                                style={{
                                    height: 'auto',
                                    padding: '1.2rem 2.5rem',
                                    fontSize: '1.2rem',
                                    width: '280px',
                                    backgroundColor: 'black'
                                }}
                            >
                                Admin Dashboard
                            </Button>
                        </Link>}

                        {status === '' && <Link to='/register'>
                            <Button
                                type='primary'
                                size='large'
                                icon={<UserAddOutlined />}
                                style={{
                                    height: 'auto',
                                    padding: '1.2rem 2.5rem',
                                    fontSize: '1.2rem',
                                    width: '280px',
                                    backgroundColor: 'black'
                                }}
                            >
                                Register
                            </Button>
                        </Link>}

                        {status === '' && <Link to='/login'>
                            <Button
                                type='primary'
                                size='large'
                                icon={<LoginOutlined />}
                                style={{
                                    height: 'auto',
                                    padding: '1.2rem 2.5rem',
                                    fontSize: '1.2rem',
                                    width: '280px',
                                    backgroundColor: 'black'
                                }}
                            >
                                Login
                            </Button>
                        </Link>}

                        {status !== '' && <Button
                            type='primary'
                            size='large'
                            icon={<LogoutOutlined />}
                            style={{
                                height: 'auto',
                                padding: '1.2rem 2.5rem',
                                fontSize: '1.2rem',
                                width: '280px',
                                backgroundColor: 'black'
                            }}
                            onClick={sendLogout}
                        >
                            Logout
                        </Button>}
                    </Space>
                </div>
            </Content>

            <Footer style={{ background: '#f5f5f5' }}>
                <div className='max-w-4xl mx-auto'>
                    <div className='flex flex-col md:flex-row justify-between items-center'>
                        <div className='mb-4 md:mb-0'>
                            <span>©2025 IEEE MESH - All rights reserved.</span>
                        </div>
                        <Space split={<Divider type='vertical' style={{ borderColor: 'black' }} />}>
                            <Link to='#' className='hover:text-blue-600'>About us</Link>
                            <Link to='#' className='hover:text-blue-600'>Privacy</Link>
                            <Link to='#' className='hover:text-blue-600'>Contact</Link>
                        </Space>
                    </div>
                </div>
            </Footer>
        </Layout>
    );
};

export default LandingPage;