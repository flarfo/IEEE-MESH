import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import { useSendLogoutMutation } from '../features/auth/authApiSlice';

const DASH_REGEX = /^\/dash(\/)?$/;
const MEMBERS_REGEX = /^\/dash\/members(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;


const DashHeader = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation(); 

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation();

    useEffect(() => {
        if (isSuccess) navigate('/');
    }, [isSuccess, navigate]);

    if (isLoading) return <p>Logging Out...</p>;
    if (isError) return <p>Error: {error.data?.message}</p>

    const logoutButton = (
        <button className='' title='Logout' onClick={sendLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    );

    return (
        <header className='sticky top-0 z-1 p-0 border-b-1'>
            <div className='dash-header__container'>
                <Link to='/dash'>
                    <h1 className='dash-header__title'>IEEE Mesh</h1>
                </Link>
                <nav className='dash-header__nav'>
                    {/* add nav buttons later */}
                    {logoutButton}
                </nav>
            </div>
        </header>
    );
};

export default DashHeader;