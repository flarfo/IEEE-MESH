import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Space } from 'antd';
import { TeamOutlined, ExperimentOutlined, BankOutlined } from '@ant-design/icons';

const DataContainer = ({ members }) => {
    // Calculate statistics from members data
    const stats = useMemo(() => {
        if (!members?.ids) return {
            totalMembers: 0,
            uniqueResearch: 0,
            uniqueInternships: 0,
            researchDistribution: [],
        };

        const researchAreas = new Set();
        const internships = new Set();
        const researchCount = {};

        members.ids.forEach(id => {
            const member = members.entities[id];
            // Count unique research areas
            member.research?.forEach(area => {
                researchAreas.add(area);
                researchCount[area] = (researchCount[area] || 0) + 1;
            });
            // Count unique internships
            member.internships?.forEach(internship => internships.add(internship));
        });

        return {
            totalMembers: members.ids.length,
            uniqueResearch: researchAreas.size,
            uniqueInternships: internships.size,
        };
    }, [members]);

    return (
        <div className='mb-6'>
            <Space direction="vertical" className="w-full" size="large">
                {/* Statistics Cards */}
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                        <Card className="text-center">
                            <Statistic
                                title="Total Members"
                                value={stats.totalMembers}
                                prefix={<TeamOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="text-center">
                            <Statistic
                                title="Research Areas"
                                value={stats.uniqueResearch}
                                prefix={<ExperimentOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="text-center">
                            <Statistic
                                title="Internship Partners"
                                value={stats.uniqueInternships}
                                prefix={<BankOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>
            </Space>
        </div>
    );
};

export default DataContainer;