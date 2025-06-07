import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApiSlice';

import usePersist from '../../hooks/usePersist';

const Login = () => {
    const identifierRef = useRef();
    const errRef = useRef();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [persist, setPersist] = usePersist();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();

    // focus email field on load
    useEffect(() => {
        identifierRef.current.focus();
    }, []);

    // clear error message field on email/password change 
    useEffect(() => {
        setErrMsg('');
    }, [identifier, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // try login and get access token
            const { accessToken } = await login({ identifier, password }).unwrap();
            dispatch(setCredentials({ accessToken })); // save access token
            
            setIdentifier('');
            setPassword('');

            // TODO: reroute to homepage
            navigate('/');
        }
        catch (err) {
            // Display error message
            if (!err.status) {
                setErrMsg('No server response.');
            }
            else if (err.status === 400) {
                setErrMsg('Missing username/email or password.');
            }
            else if (err.status === 401) {
                setErrMsg('Unauthorized');
            }
            else {
                setErrMsg(err.data?.message);
            }

            // Focus error field
            errRef.current?.focus();
        }
    }
    
    const handleIdentifierInput = (e) => setIdentifier(e.target.value);
    const handlePasswordInput = (e) => setPassword(e.target.value);
    const handleTogglePersist = (e) => setPersist(prev => !prev);

    const errClass = errMsg ? 'errmsg' : 'offscreen';

    // TODO: replace Loading... with spinner/bar
    if (isLoading) return <p>Loading...</p>;

    const content = (
        <section className='flex flex-col items-center justify-center h-screen bg-gray-100'>
            <button onClick={() => {
                fetch('http://localhost:3500/debug-test-email');
            }}>
                DEBUG: Email
                <input type='text' id='debug-input'>
                </input>
            </button>
            <header className='text-2xl font-bold mb-6 text-gray-800'>
                <h1>Login</h1>
            </header>
            <main className='w-full max-w-md p-8 bg-white shadow-md rounded-lg'>
                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

                <form className='flex flex-col' onSubmit={handleSubmit}>
                    <label htmlFor="email" className='block font-medium text-gray-700'>Username/Email:</label>
                    <input
                        className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500'
                        type="text"
                        id="email"
                        ref={identifierRef}
                        value={identifier}
                        onChange={handleIdentifierInput}
                        autoComplete="off"
                        required
                    />

                    <label htmlFor="password" className='block mt-2 font-medium text-gray-700'>Password:</label>
                    <input
                        className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500'
                        type="password"
                        id="password"
                        onChange={handlePasswordInput}
                        value={password}
                        required
                    />
                    <button className='mt-4 w-full bg-black text-white font-semibold py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500'>Sign In</button>
                    <label htmlFor='persist'>
                        <input className='accent-black'
                            type='checkbox'
                            id='persist'
                            onChange={handleTogglePersist}
                            checked={persist}
                        />
                        { } Stay Logged In
                    </label>
                </form>
            </main>
            <footer className='mt-4 text-center'>
                <Link to="/">Back to Home</Link>
            </footer>
        </section>
    );

    return content;
};

export default Login;

