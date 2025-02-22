import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetMemberByUsernameQuery } from '../members/membersApiSlice';
import useAuth from '../../hooks/useAuth';
import { Card, DatePicker, Typography, Button, Input, Space, Spin, Alert, Avatar, Row, Col, Layout } from 'antd';
import { EditOutlined, UserOutlined, InstagramOutlined, GlobalOutlined, LinkedinOutlined } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const Profile = () => {
    const params = useParams();
    const { username } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [newResearch, setNewResearch] = useState({ title: '', description: '', date: '' });
    const [newExperience, setNewExperience] = useState('');
    const [editedMember, setEditedMember] = useState(null);

    const {
        data: member,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetMemberByUsernameQuery(params.username, {
        pollingInterval: 60000,
        refetchOnMountOrArgChange: true
    });

    useEffect(() => {
        if (member) {
            setEditedMember({
                ...member,
                research: [...member.research],
                internships: [...member.internships]
            });
        }
    }, [member]);

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size='large' />
            </div>
        );
    }

    if (isError) {
        return (
            <Alert
                message='Error'
                description={error?.data?.message}
                type='error'
                showIcon
            />
        );
    }

    const handleSave = () => {
        // TODO: Implement save functionality
        setIsEditing(false);
    };

    const content = (
        <>
            <Card
                style={{
                    width: '100%',
                    maxWidth: 1000,
                    margin: '0 auto',
                }}
            >
                <div
                    style={{
                        height: 200,
                        background: '#000000',
                        margin: -24,
                        marginBottom: 0,
                        position: 'relative',
                    }}
                />
                <Row justify='left' style={{ marginTop: 10, gap: 30 }}>
                    <Col>
                        <div style={{ textAlign: 'center' }}>
                            {/* Profile Picture */}
                            <Avatar
                                size={120}
                                style={{
                                    border: '4px solid white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                }}
                                icon={<UserOutlined />}
                            />
                        </div>
                    </Col>
                    <Col>
                        <div style={{ marginTop: 16 }}>
                            <Title level={3}>
                                {member?.name}
                            </Title>
                            <Text type='secondary'>{member?.email}</Text>
                            <Row style={{ gap: 5, marginTop: 8, marginLeft: -4 }}>
                                {member?.connections?.personal && <a href={member.connections.personal} target='_blank' rel='noreferrer'>
                                    <Button type='link' icon={<GlobalOutlined style={{ fontSize: '20px' }} />}></Button>
                                </a>}
                                {member?.connections?.linkedin && <a href={'https://www.linkedin.com/in/' + member.connections.linkedin} target='_blank' rel='noreferrer'>
                                    <Button type='link' icon={<LinkedinOutlined style={{ fontSize: '20px' }} />}></Button>
                                </a>}
                                {member?.connections?.instagram && <a href={'https://www.instagram.com/' + member.connections?.instagram} target='_blank' rel='noreferrer'>
                                    <Button type='link' icon={<InstagramOutlined style={{ fontSize: '20px' }} />}></Button>
                                </a>}
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Card>
            <Card style={{ marginTop: 15 }}>
                <Row gutter={[24, 24]}>
                    {/* Bio Section */}
                    <Col span={24}>
                        <Title level={4}>About</Title>
                        {isEditing ? (
                            <Input.TextArea
                                value={editedMember?.bio}
                                onChange={(e) => setEditedMember({
                                    ...editedMember,
                                    bio: e.target.value
                                })}
                                rows={4}
                                placeholder="Write something about yourself..."
                            />
                        ) : (
                            <Text type='secondary'>{editedMember?.bio || "No bio available"}</Text>
                        )}
                    </Col>

                    <Col span={24}>
                        <Title level={4}>Research</Title>
                        {editedMember?.research?.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {editedMember?.research.map((item, index) => (
                                    <Card
                                        key={index}
                                        size="small"
                                        style={{
                                            width: 'calc(50% - 6px)',
                                            borderRadius: '8px',
                                            backgroundColor: '#f5f5f5'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <Text strong>{item.title}</Text>
                                                <div>
                                                    <Text type="secondary">{item.description}</Text>
                                                </div>
                                                <div style={{ marginTop: '8px' }}>
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                        {item.date}
                                                    </Text>
                                                </div>
                                            </div>
                                            {isEditing && (
                                                <Button
                                                    type="text"
                                                    danger
                                                    size="small"
                                                    onClick={() => {
                                                        const newResearch = [...editedMember.research];
                                                        newResearch.splice(index, 1);
                                                        setEditedMember({
                                                            ...editedMember,
                                                            research: newResearch
                                                        });
                                                    }}
                                                >
                                                    ×
                                                </Button>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Text type="secondary">No research projects added yet</Text>
                        )}

                        {/* Add New Research Form */}
                        {isEditing && (
                            <div style={{ marginTop: '16px' }}>
                                <Card size="small" style={{ backgroundColor: '#f9f9f9' }}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Input
                                            placeholder="Research Title"
                                            value={newResearch.title}
                                            onChange={(e) => setNewResearch({
                                                ...newResearch,
                                                title: e.target.value
                                            })}
                                        />
                                        <Input.TextArea
                                            placeholder="Research Description"
                                            value={newResearch.description}
                                            onChange={(e) => setNewResearch({
                                                ...newResearch,
                                                description: e.target.value
                                            })}
                                        />
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            placeholder="Select date"
                                            onChange={(date, dateString) => setNewResearch({
                                                ...newResearch,
                                                date: dateString
                                            })}
                                            format="YYYY-MM-DD"
                                        />
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                if (newResearch.title && newResearch.description) {
                                                    setEditedMember({
                                                        ...editedMember,
                                                        research: [...editedMember.research, newResearch]
                                                    });
                                                    setNewResearch({ title: '', description: '', date: '' });
                                                }
                                            }}
                                        >
                                            Add Research
                                        </Button>
                                    </Space>
                                </Card>
                            </div>
                        )}
                    </Col>
                </Row>
            </Card>
        </>
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '24px auto', padding: '0 24px' }}>
            {isSuccess && content}
            {username === params.username && (
                <div style={{ textAlign: 'right', marginTop: '16px' }}>
                    {isEditing ? (
                        <Space>
                            <Button type='primary' onClick={handleSave}>
                                Save
                            </Button>
                            <Button onClick={() => {
                                setIsEditing(false);
                                setEditedMember({
                                    ...member,
                                    research: [...member.research],
                                    internships: [...member.internships]
                                });
                            }}>
                                Cancel
                            </Button>
                        </Space>
                    ) : (
                        <Button
                            type='primary'
                            icon={<EditOutlined />}
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile;