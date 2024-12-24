import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import { store } from '../../app/store'
import { membersApiSlice } from '../members/membersApiSlice'
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {

    useEffect(() => {
        console.log('subscribing');
        // create manual subscriptions to our data to maintain state after getting data,
        // this will prevent our data from expiring and our state changing (to whatever state exists for null data)
        const members = store.dispatch(membersApiSlice.endpoints.getMembers.initiate());
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

        return () => {
            console.log('unsubscribing');
            // unsubscribe on page exit
            members.unsubscribe();
            users.unsubscribe();
        }
    }, [])

    return <Outlet />
};

export default Prefetch;