import { useGetMembersQuery } from './membersApiSlice';
import Member from './Member';

const MembersList = () => {
    const {
        data: members,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetMembersQuery(null, {
        pollingInterval: 15000, // refresh data every 15 seconds, on focus, on mount 
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let content;

    if (isLoading) {
        content = <p>Loading...</p>
    }

    if (isError) {
        content = <p>{error?.data?.message}</p>
    }
    
    if (isSuccess) {
        const { ids } = members;
        const databaseContent = ids?.length ? ids.map(memberId => <Member key={memberId} memberId={memberId} />) : null;

        content = (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
                {/* Page Title */}
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Member Profiles</h1>

                {/* Scrollable Container */}
                <div className="w-full max-w-4xl h-[80vh] overflow-y-auto px-4">
                    {databaseContent}
                </div>
            </div>
        );
    }

    return content;
};

export default MembersList;