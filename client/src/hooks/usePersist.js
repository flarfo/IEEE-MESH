import { useState, useEffect } from 'react';

// Persistent login, used for 'Stay Logged In' toggle
const usePersist = () => {
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem('persist')) || false);

    useEffect(() => {
        // Store persistent data in localStorage on 'persist' change
        localStorage.setItem('persist', JSON.stringify(persist));
    }, [persist]);

    return [persist, setPersist];
};

export default usePersist;