// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Button, Drawer, Layout } from 'antd';
import {
    DatabaseOutlined,
    UserAddOutlined,
    DashboardOutlined,
    LogoutOutlined,
    LoginOutlined,
    ProfileOutlined,
    HomeOutlined,
    MenuOutlined
} from '@ant-design/icons';
import useAuth from '../hooks/useAuth';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';

const { Header } = Layout;

const Navbar = () => {
    const { status, username } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [sendLogout] = useSendLogoutMutation();

    // Define menu items based on user status
    const getMenuItems = () => {
        const items = [
            {
                key: 'home',
                icon: <HomeOutlined />,
                label: 'Home',
                onClick: () => navigate('/')
            }
        ];

        if (status !== '') {
            items.push({
                key: 'database',
                icon: <DatabaseOutlined />,
                label: 'Database',
                onClick: () => navigate('/database/members')
            });

            items.push({
                key: 'profile',
                icon: <ProfileOutlined />,
                label: 'Profile',
                onClick: () => navigate(`/profile/${username}`)
            });
        }

        if (status === 'Admin') {
            items.push({
                key: 'admin',
                icon: <DashboardOutlined />,
                label: 'Admin Dashboard',
                onClick: () => navigate('/dash')
            });
        }

        if (status === '') {
            items.push({
                key: 'register',
                icon: <UserAddOutlined />,
                label: 'Register',
                onClick: () => navigate('/register')
            });

            items.push({
                key: 'login',
                icon: <LoginOutlined />,
                label: 'Login',
                onClick: () => navigate('/login')
            });
        }

        if (status !== '') {
            items.push({
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Logout',
                onClick: () => {
                    sendLogout();
                    setMobileMenuOpen(false);
                },
                danger: true
            });
        }

        return items;
    };

    return (
        <>
            <Header className="p-0 h-16 bg-transparent backdrop-filter backdrop-blur-sm bg-black bg-opacity-30 border-b border-gray-800 sticky top-0 z-50">
                <div className="flex justify-between items-center h-full px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/">
                            <img
                                src='/images/MESH.svg'
                                alt='MESH Logo'
                                className='h-8'
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <Menu
                            mode="horizontal"
                            theme="light"
                            items={getMenuItems()}
                            className="bg-transparent border-0"
                            style={{
                                minWidth: '400px',
                                display: 'flex',
                                justifyContent: 'flex-end'
                            }}
                        />
                    </div>

                    {/* Mobile Navigation Toggle */}
                    <div className="md:hidden">
                        <Button
                            type="text"
                            icon={<MenuOutlined style={{ fontSize: '20px', color: 'white' }} />}
                            onClick={() => setMobileMenuOpen(true)}
                            className="border-0 bg-transparent hover:bg-gray-800"
                        />
                    </div>
                </div>
            </Header>

            {/* Mobile Navigation Drawer */}
            <Drawer
                title={
                    <div className="flex items-center">
                        <img
                            src="/images/MESH.svg"
                            alt="MESH Logo"
                            className="h-6 mr-2"
                        />
                        <span>Menu</span>
                    </div>
                }
                placement="right"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                width={280}
                bodyStyle={{ padding: 0 }}
                headerStyle={{ borderBottom: '1px solid #333' }}
            >
                <Menu
                    mode="vertical"
                    theme="dark"
                    style={{ background: '#111', height: '100%' }}
                    items={getMenuItems()}
                    onClick={() => setMobileMenuOpen(false)}
                />
            </Drawer>
        </>
    );
};

export default Navbar;