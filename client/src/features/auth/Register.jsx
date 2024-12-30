import React, { useState } from 'react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => { 
        e.preventDefault();

        try {
            const payload = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            };

            const res = await fetch(`${process.env.REACT_APP_DEV_API_URL}/register`, payload);

            if (res.ok) {
                setEmail('');
                setPassword('');
                // NAVIGATE TO MEMBER SETUP
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            
        </>
    );
};

export default Register;