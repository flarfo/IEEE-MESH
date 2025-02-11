import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
    const token = useSelector(selectCurrentToken);

    let isGuest = false;
    let isMember = false;
    let isAdmin = false;
    let status = '';
    
    if (token) {
        const decoded = jwtDecode(token);
        const { username, roles } = decoded.UserInfo;

        isGuest = roles.includes('Guest');
        isMember = roles.includes('Member');
        isAdmin = roles.includes('Admin');

        if (isGuest) status = 'Guest';
        if (isMember) status = 'Member';
        if (isAdmin) status = 'Admin';

        return { username, roles, isAdmin, status }
    }

    return { username: '', roles: [], isAdmin, status };
};

export default useAuth;