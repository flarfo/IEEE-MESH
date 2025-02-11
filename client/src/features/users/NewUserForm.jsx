// NON-PUBLIC FACING USER CREATION, USED TO CREATE NEW ACCOUNTS DIRECTLY AS AN ADMIN
import { useState, useEffect } from 'react';
import { useAddNewUserMutation } from './usersApiSlice';
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { ROLES } from '../../config/roles';

const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const NewUserForm = () => {
    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation();

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);

    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);

    const [roles, setRoles] = useState(['Member']);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        if (isSuccess) {
            setEmail('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess, navigate]);

    const onEmailChanged = (e) => setEmail(e.target.value);
    const onUsernameChanged = (e) => setUsername(e.target.value);
    const onPasswordChanged = (e) => setPassword(e.target.value);
    const onRolesChanged = (e) => {
        const values = Array.from(
            e.target.selectedOptions, // HTMLCollection, build an array of roles
            (option) => option.value
        );
        setRoles(values);
    };

    // Verify that User information is valid
    const canSave = [roles.length, validEmail, validPassword].every(Boolean) && !isLoading;
    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        if (canSave) {
            await addNewUser({ email, username, password, roles });
        }
    };
    // Create dropdown menu for each role (which role to assign the new User)
    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}
            > {role}</option >
        )
    })
    const errClass = isError ? 'errmsg' : 'offscreen';
    const validUserClass = !validEmail ? 'form__input--incomplete' : '';
    const validPwdClass = !validPassword ? 'form__input--incomplete' : '';
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : '';
    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form__title-row">
                    <h2>New User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="email">
                    Email: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="off"
                    value={email}
                    onChange={onEmailChanged}
                />

                <label className="form__label" htmlFor="username">
                    Username: <span className="nowrap">[x letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />
                <label className="form__label" htmlFor="roles">
                    ASSIGNED ROLES:</label>
                <select
                    id="roles"
                    name="roles"
                    className={`form__select ${validRolesClass}`}
                    multiple={true}
                    size="3"
                    value={roles}
                    onChange={onRolesChanged}
                >
                    {options}
                </select>
            </form>
        </>
    );
    return (
        content
    );
};

export default NewUserForm;