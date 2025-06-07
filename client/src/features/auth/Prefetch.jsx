import { store } from '../../app/store';
import { usersApiSlice } from '../users/usersApiSlice';
import { hubsApiSlice } from '../hubs/hubsApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Prefetch = () => {
    const { isAuthenticated, username, uid, role } = useAuth();
    
    useEffect(() => {
        console.log('Initializing data subscriptions');
        
        // Track subscriptions to unsubscribe later
        const subscriptions = [];
        
        if (isAuthenticated) {
            // Always fetch current user data for authenticated users
            const currentUser = store.dispatch(usersApiSlice.endpoints.getCurrentUser.initiate(uid));
            subscriptions.push(currentUser);
            
            // Always fetch user's hubs for authenticated users
            const userHubs = store.dispatch(hubsApiSlice.endpoints.getUserHubs.initiate());
            subscriptions.push(userHubs);
            
            // Admin-specific prefetches
            if (role === 'Admin') {
                const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());
                subscriptions.push(users);
                
                // If you have admin-specific hub operations
                const allHubs = store.dispatch(hubsApiSlice.endpoints.getAllHubs.initiate());
                subscriptions.push(allHubs);
            }
        }
        
        // Cleanup function to unsubscribe from all initiated subscriptions
        return () => {
            console.log('Cleaning up data subscriptions');
            subscriptions.forEach(subscription => subscription.unsubscribe());
        };
    }, [isAuthenticated, username]);
    
    return <Outlet />;
};

export default Prefetch;