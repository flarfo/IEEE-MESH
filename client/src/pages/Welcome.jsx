import { Link, useActionData } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Welcome = () => {
    const { email, isManager, isAdmin } = useAuth();
    
    const date = new Date();
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date);

    return (
        <section className='welcome'>

            <p>{today}</p>

            <h1>Welcome!</h1>

            <p><Link to='/database/members'>View Database</Link></p>

            {(isAdmin) && <p><Link to='/dash/users'>View Users</Link></p>}
            {(isAdmin) && <p><Link to='/dash/users/new'>Add New User</Link></p>}
            {(isAdmin) && <p><Link to='/dash/hubs'>View School Hubs</Link></p>}

        </section>
    );
};

export default Welcome;