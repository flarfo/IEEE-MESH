import { useGetUsersQuery } from './usersApiSlice';
import User from './User';

const UsersList = () => {
    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery(null, {
        pollingInterval: 60000, // refresh data every 60 seconds, on focus, on mount 
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
        const { ids } = users;
        const tableContent = ids?.length ? ids.map(userId => <User key={userId} userId={userId} />) : null;

        content = (
            <table>
                <thead>
                    <tr>
                        <th scope='col'>Email</th>
                        <th scope='col'>Roles</th>
                        <th scope='col'>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        );
    }

    return content;
};

export default UsersList;