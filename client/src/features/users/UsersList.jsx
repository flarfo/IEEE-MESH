import React from 'react';
import { useGetUsersQuery } from './usersApiSlice';
import User from './User';
import { Typography, Spin, Alert, Space } from 'antd';
import useAuth from '../../hooks/useAuth';

const { Title } = Typography;

const UsersList = () => {
    const { hubId } = useAuth();

    // ADMIN PAGE
    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery('usersList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let content;

    if (isLoading) {
        content = (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (isError) {
        content = (
            <Alert
                message="Error"
                description={error?.data?.message || 'Failed to load users'}
                type="error"
                showIcon
            />
        );
    }

    if (isSuccess) {
        const { ids } = users;

        content = (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
                <Title level={2} style={{ marginBottom: '24px' }}>
                    Users List
                </Title>
                <Space
                    direction="vertical"
                    size="middle"
                    style={{ display: 'flex' }}
                >
                    {ids?.length
                        ? ids.map(userId => <User key={userId} userId={userId} />)
                        : <Alert
                            message="No users found"
                            type="info"
                            showIcon
                          />
                    }
                </Space>
            </div>
        );
    }

    return content;
};

export default UsersList;