import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenSquare, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectUserById } from './usersApiSlice';

const User = ({ userId }) => {
    const user = useSelector(state => selectUserById(state, userId));
    const navigate = useNavigate();

    if (user) {
        const handleEdit = () => navigate(`/dash/users/${userId}`);
        const userRolesString = user.roles.toString().replaceAll(',', ', ');

        return (
            <tr>
                <td>{user.email}</td>
                <td>{userRolesString}</td>
                <td>
                    <button onClick={handleEdit}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        );
    }
    else {
        return null;
    }
};

export default User;