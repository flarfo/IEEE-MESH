import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserById } from './usersApiSlice';
import EditUserForm from './EditUserForm';

const EditUser = () => {

    const { id } = useParams(); // get id from URL params
    const user = useSelector(state => selectUserById(state, id));

    // if user exists, open EditUserForm
    const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>;

    return content;
};

export default EditUser;