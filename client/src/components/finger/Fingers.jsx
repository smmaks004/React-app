import React, { useEffect, useState } from 'react';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';

import CreateFinger from './CreateFinger'
import PendingFingers from './PendingFingers';

const Fingers = () => {
    const [error, setError] = useState(null);
    const [fingers, setFingers] = useState([]);

    const fetchFingers = async () => {
        try {
            const res = await fetch('/api/fingers');
            if (!res.ok) throw new Error('Failed to fetch fingers');
            
            const { data } = await res.json();
            
            setFingers(data || []);
        } catch (err) {
            console.error('Error fetching fingers:', err);
            setError(err.message);
        }
    };

    const deleteFinger = async (fingerId) => {
        if (!window.confirm('Are you sure you want to delete this finger?')) return;

        try {
            const res = await fetch(`/api/fingers/delete/${fingerId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete finger');
            
            await fetchFingers();
        } catch (err) {
            console.error('Error deleting finger:', err);
            // alert('Error deleting finger: ' + err.message);
        }
    };


    useEffect(() => {
        fetchFingers();
    }, []);


    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Fingers Page</h2>

            {/* Create Card Section */}
            <CreateFinger />

            <PendingFingers onFingerApproved={fetchFingers} />


            <h3>All Fingers</h3>
            <ul className="fingers-list">
                {fingers.map((finger) => (
                    <li key={finger._id}>
                        {/* <strong>Finger Name: </strong> {finger.name} <strong>Hex:</strong> {finger.fingerHex}  |  */}
                        <strong>User:</strong> {
                        finger.userId ? `${finger.userId.name} 
                        ${finger.userId.surname} 
                        (${finger.userId.email})` : 'No user'}
                        <button onClick={() => deleteFinger(finger._id)}>Delete</button>
                    </li>
                ))}
            </ul>

        </div>
    );

}

export default Fingers;