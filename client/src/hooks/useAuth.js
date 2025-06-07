import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';
import { useGetHubByNameQuery, selectHubIdByName } from '../features/hubs/hubsApiSlice';

const useAuth = () => {
    const token = useSelector(selectCurrentToken);
    const { hubName } = useParams;

    // Skip query if no hub name (e.g., we're at root level)
    const skipQuery = !hubName || hubName === 'root';
    
    const { 
        data: hub, 
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetHubByNameQuery(hubName, { skip: skipQuery });

    let hubId = hubName === 'root' ? 'root' : null;
    let isGuest = false;
    let isMember = false;
    let isAdmin = false;
    let status = '';
    let username = '';
    let roles = {};
    let hubRoles = [];
    
    if (isSuccess && hub) {
        hubId = hub.id;
    }

    if (token) {
        const decoded = jwtDecode(token);
        ({ username, role } = decoded.UserInfo);
        
        const currentHubId = hubId || 'root';

        try {
            isGuest = roles[currentHubId]?.includes('Guest') || false;
            isMember = roles[currentHubId]?.includes('Member') || false;
            isAdmin = roles[currentHubId]?.includes('Admin') || false;
            hubRoles = roles[currentHubId];
        } catch (err) {
            isGuest = true;
            isAdmin = false;
            hubRoles = ['Guest'];
        }

        if (isAdmin) status = 'Admin';
        else if (isMember) status = 'Member';
        else if (isGuest) status = 'Guest';
    }

    return { 
        username, 
        roles: hubRoles, 
        isAdmin, 
        isMember, 
        isGuest, 
        status, 
        hubId,
        hubName,
        hub,
        isLoadingHub: isLoading,
        isHubError: isError,
        hubError: error
    };
};

export default useAuth;