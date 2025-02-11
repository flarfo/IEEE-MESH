import { useLocation, useParams, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RequireAuth = ({ allowedRoles, checkSpecificUser }) => {
    const location = useLocation();
    const { roles, username } = useAuth();
    const params = useParams();

    const verifiedUser = (checkSpecificUser ? username === params.username : true);
    const verifiedRoles = roles.some(role => allowedRoles.includes(role));
    
    const content = (
        // Check if some role in current users roles is allowed, if yes provide an outlet, if no, reroute to login
       (verifiedUser && verifiedRoles) ? <Outlet /> : <Navigate to='/login' state={{ from: location}} replace />
    );

    return content;
};

export default RequireAuth;