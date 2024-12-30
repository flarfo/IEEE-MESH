import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
    const token = useSelector(selectCurrentToken);

    let isManager = false;
    let isAdmin = false;
    let status = 'Member';
    
    if (token) {
        const decoded = jwtDecode(token);
        const { email, roles } = decoded.UserInfo;

        isManager = roles.includes('Manager');
        isAdmin = roles.includes('Admin');

        if (isManager) status = isManager;
        if (isAdmin) status = isAdmin;

        return { email, roles, isManager, isAdmin, status }
    }

    return { email: '', roles: [], isManager, isAdmin, status };
};

export default useAuth;