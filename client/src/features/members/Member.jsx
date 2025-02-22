import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Tag, Typography, Avatar, Space, Tooltip } from 'antd';
import { UserOutlined, ProjectOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectMemberById } from './membersApiSlice';

const { Text, Paragraph, Title } = Typography;

const Member = ({ memberId }) => {
    const member = useSelector(state => selectMemberById(state, memberId));

    if (!member) return null;

    // Color map for research tags - you can customize these colors
    const colorMap = [
        'magenta', 'red', 'volcano', 'orange', 'gold',
        'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'
    ];

    return (
        <div>
            <Link to={'/profile/' + member.username}>
                <Card
                    hoverable
                    className="w-full"
                    bodyStyle={{ padding: 24 }}
                >
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Left Section - Avatar */}
                        <div className="flex-shrink-0 flex justify-center">
                            <Avatar
                                size={120}
                                src={member.picture || null}
                                icon={!member.picture && <UserOutlined />}
                            />
                        </div>

                        {/* Right Section - Content */}
                        <div className="flex-grow">
                            {/* Name and Basic Info */}
                            <div className="mb-4">
                                <Title level={4} className="mb-1">
                                    {member.name}
                                </Title>
                                {member.title && (
                                    <Text type="secondary">
                                        {member.title}
                                    </Text>
                                )}
                            </div>

                            {/* Research Areas */}
                            <div className="mb-4">
                                <Space size={[0, 8]} wrap>
                                    {member.research.map((research, index) => (
                                        <Tooltip key={research} title="Research Area">
                                            <Tag
                                                color={colorMap[index % colorMap.length]}
                                                icon={<ProjectOutlined />}
                                            >
                                                {research}
                                            </Tag>
                                        </Tooltip>
                                    ))}
                                </Space>
                            </div>

                            {/* Bio */}
                            <Paragraph
                                ellipsis={{
                                    rows: 3,
                                    expandable: true,
                                    symbol: 'more'
                                }}
                                className="text-gray-600"
                            >
                                {member.bio}
                            </Paragraph>

                            {/* Internships/Experience - Only show if exists */}
                            {member.internships && member.internships.length > 0 && (
                                <div className="mt-2">
                                    <Text strong className="text-sm">Experience: </Text>
                                    <Space size={[0, 4]} wrap>
                                        {member.internships.map((internship, index) => (
                                            <Tag key={index} color="default">
                                                {internship}
                                            </Tag>
                                        ))}
                                    </Space>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </Link>
        </div>
    );
};

export default Member;