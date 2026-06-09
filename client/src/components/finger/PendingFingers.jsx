import React, { useEffect, useState } from 'react';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';


const PendingFingers = ({ onFingerApproved }) => {

    // const [commands, setCommands] = useState([]);
    const [fingers, setFingers] = useState([]);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);

    // const [selectedUsersByCommand, setSelectedUsersByCommand] = useState({});
    const [selectedUsersByFinger, setSelectedUsersByFinger] = useState({});


    // const fetchCommands = async () => {
    //     try {
    //         const res = await fetch('/api/commands/fingers');
    //         if (!res.ok) throw new Error('Failed to fetch commands');

    //         const { data } = await res.json();
            
    //         setCommands(data || []);
    //     } catch (err) {
    //         console.error('Error fetching commands:', err);
    //         setError(err.message);
    //     }
    // };

    const fetchPendingFingers = async () => {
        try {
            const res = await fetch('/api/fingers/pending');
            if (!res.ok) throw new Error('Failed to fetch pending fingers');

            const { data } = await res.json();
            
            setFingers(data || []);
        } catch (err) {
            console.error('Error fetching pending fingers:', err);
            setError(err.message);
        }
    };



    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (!res.ok) throw new Error('Failed to fetch users');
            const { data, message, status } = await res.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        }
    };

    // const approveFinger = async (commandId, selectedUserId) => {
    //     try {
    //         const res = await fetch('/api/fingers/trigger-approval', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ commandId, userId: selectedUserId }),
    //         });

    //         const data = await res.json();

    //         if (res.ok && data && data.success) {
    //             alert('Finger approved successfully!');
    //             // fetchCommands(); // Refresh the list after approval
    //             fetchPendingFingers(); 
    //             if (onFingerApproved) onFingerApproved();
    //             // setSelectedUsersByCommand((prev) => ({ ...prev, [commandId]: '' }));
    //             setSelectedUsersByFinger((prev) => ({ ...prev, [commandId]: '' }));
    //         } else {
    //             alert(data.error || 'Failed to approve finger');
    //         }
    //     } catch (err) {
    //         console.error(err);
    //         alert('Network error while approving finger');
    //     }
    // };


    const approveFinger = async (fingerId, selectedUserId) => {
        try {
            const res = await fetch('/api/fingers/trigger-approval', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fingerId: fingerId, userId: selectedUserId }),
            });

            const data = await res.json();

            if (res.ok && data && data.success) {
                alert('Finger approved successfully!');
                // fetchCommands(); // Refresh the list after approval
                fetchPendingFingers(); 
                if (onFingerApproved) onFingerApproved();
                // setSelectedUsersByCommand((prev) => ({ ...prev, [commandId]: '' }));
                setSelectedUsersByFinger((prev) => ({ ...prev, [fingerId]: '' }));
            } else {
                alert(data.error || 'Failed to approve finger');
            }
        } catch (err) {
            console.error(err);
            alert('Network error while approving finger');
        }
    };

        

    useEffect(() => {
        fetchPendingFingers();
        fetchUsers();
    }, []);

    return (
        <div>
            <h3>Pending Fingers</h3>
            <ul className="fingers-list">
                {fingers.map((finger) => (
                    <li key={finger._id}> 
                        {/* <strong>Finger templateData:</strong> {finger.templateData || 'N/A'} */}
                        <strong>Finger templateData:</strong> {finger.templateData || 'N/A'}
                        <select
                            value={selectedUsersByFinger[finger._id] || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedUsersByFinger((prev) => ({ ...prev, [finger._id]: value }));
                            }}
                            required
                        >
                            <option value="">Select User</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.name} {user.surname}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={() => approveFinger(
                                finger._id, 
                                selectedUsersByFinger[finger._id]
                            )}
                            disabled={!selectedUsersByFinger[finger._id]}
                        >
                            Approve
                        </button>
                    </li>
                ))}
            </ul>

        </div>
    );

}

export default PendingFingers;