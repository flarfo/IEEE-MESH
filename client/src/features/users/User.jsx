import React from 'react';
import { Card, Tag, Typography, Avatar, Space, Button } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectUserById } from './usersApiSlice';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

const User = ({ userId }) => {
    const user = useSelector(state => selectUserById(state, userId));
    const navigate = useNavigate();

    if (!user) return null;

    const handleEdit = () => navigate(`/dash/users/${userId}`);

    // Color map for role tags
    const roleColors = {
        Employee: 'blue',
        Admin: 'red',
        Manager: 'green'
    };

    return (
        <div>
            <Card
                hoverable
                className="w-full"
                styles={{ body: { padding: 24 } }}
                style={{ borderColor: user.verified ? '#20bb02' : '#ff0101' }}
                
            >
                <div className="flex flex-col md:flex-row gap-6">
                    <div>
                        <div className="mb-4">
                            <Title level={4} className="mb-1">
                                {user.email}
                            </Title>
                            <Text>
                                User ID: {userId}
                            </Text>
                        </div>

                        <div className="mb-4">
                            <Space size={[0, 8]} wrap>
                                {Object.keys(user.roles).map((hubId, index) => (
                                    <Tag
                                        key={index}
                                        color={roleColors[hubId] || 'default'}
                                    >
                                        {hubId}: {user.roles[hubId]}
                                    </Tag>
                                ))}
                            </Space>
                        </div>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={handleEdit}
                            ghost
                        >
                            Edit User
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default User;