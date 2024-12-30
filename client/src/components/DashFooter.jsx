import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const DashFooter = () => {
    const { email, status } = useAuth();

    const navigate = useNavigate();
    const { pathname } = useLocation();
    
    const onGoHomeClicked = () => navigate('/dash');

    let goHomeButton = null;
    if (pathname !== '/dash') {
        goHomeButton = (
            <button 
                title='Home'
                onClick={onGoHomeClicked}
            >
                <FontAwesomeIcon icon={faHouse} />
            </button>
        );
    }

    return (
        <footer className='dash-footer'>
            {goHomeButton}
            <p>Current User: {email}</p>
            <p>Status: {status}</p>
        </footer>
    );
};

export default DashFooter;