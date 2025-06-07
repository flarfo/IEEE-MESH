import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
    const token = useSelector(selectCurrentToken);

    let isAdmin = false;
    let isGuest = true;
    let username = '';
    let uid = '';
    let role;
    let isAuthenticated = false;


    if (token) {
        const decoded = jwtDecode(token);
        ({ username, uid, role } = decoded.UserInfo);
        isAuthenticated = true;
        isAdmin = role === 'Admin';
    }
    else {
        role = 'Guest'
    }

    return { 
        username,
        uid, 
        isAdmin, 
        isGuest,
        isAuthenticated,
        role
    };
};

export default useAuth;