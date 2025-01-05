import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation();
    const { roles } = useAuth();

    const content = (
        // Check if some role in current users roles is allowed, if yes provide an outlet, if no, reroute to login
       (roles.some(role => allowedRoles.includes(role))) ? <Outlet /> : <Navigate to='/login' state={{ from: location}} replace />
    );

    return content;
};

export default RequireAuth;