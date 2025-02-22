import React, { useState, useMemo } from 'react';
import { Layout, Input, Spin, Card, Alert, Select, Space, Empty, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Member from './Member';
import DataContainer from './DataContainer';
import { useGetMembersQuery } from './membersApiSlice';

const { Content } = Layout;
const { Option } = Select;

const ITEMS_PER_PAGE = 5; // Adjust as needed

const MembersList = () => {
    // State for filters
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [researchFilter, setResearchFilter] = useState([]);

    // Fetch members data
    const {
        data: members,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetMembersQuery('membersList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    // Get unique research areas for filter
    const uniqueResearchAreas = useMemo(() => {
        if (!members?.ids) return [];
        const areas = new Set();
        members.ids.forEach(id => {
            members.entities[id].research.forEach(area => areas.add(area));
        });
        return Array.from(areas);
    }, [members]);

    // Filter members based on search and research areas
    // Filter members based on search and research areas
    const filteredMembers = useMemo(() => {
        if (!members?.ids) return [];
        return members.ids.filter(id => {
            const member = members.entities[id];

            const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || (member.bio && member.bio.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesResearch = researchFilter.length === 0 || member.research.some(area => researchFilter.includes(area));

            return matchesSearch && matchesResearch;
        });
    }, [members, searchTerm, researchFilter]);

    // Calculate pagination
    const totalItems = filteredMembers.length;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentMembers = filteredMembers.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Optionally scroll to top of list
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Reset to first page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, researchFilter]);

    let content;

    if (isLoading) {
        content = <Spin size="large" className="flex justify-center my-8" />;
    }
    else if (isError) {
        content = <Alert
            message="Error"
            description={error?.data?.message || 'Failed to load members'}
            type="error"
            showIcon
        />;
    }
    else if (isSuccess && filteredMembers.length === 0) {
        content = <Empty description="No members found" />;
    }
    else if (isSuccess) {
        content = (
            <>
                <div className="space-y-4 mb-6">
                    {currentMembers.map(memberId => (
                        <Member key={memberId} memberId={memberId} />
                    ))}
                </div>
                <div className="flex justify-center my-6">
                    <Pagination
                        current={currentPage}
                        total={totalItems}
                        pageSize={ITEMS_PER_PAGE}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} members`}
                    />
                </div>
            </>
        );
    }

    return (
        <Layout className="min-h-screen bg-gray-100">
            <Content className="p-4 md:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    {isSuccess && <DataContainer members={members} />}
                    {/* Filters Section */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <Space direction="vertical" className="w-full">
                            <Input
                                placeholder="Search by name or bio..."
                                prefix={<SearchOutlined />}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="mb-4"
                            />
                            <Select
                                mode="multiple"
                                placeholder="Filter by research areas"
                                value={researchFilter}
                                onChange={setResearchFilter}
                                className="w-full"
                            >
                                {uniqueResearchAreas.map(area => (
                                    <Option key={area} value={area}>
                                        {area}
                                    </Option>
                                ))}
                            </Select>
                        </Space>
                    </div>
                    {content}
                </div>
            </Content>
        </Layout>
    );
};

export default MembersList;