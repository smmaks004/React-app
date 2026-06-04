import React, { useEffect, useState } from 'react';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';

import './Cards.css';


const PendingCards = ({ onCardApproved }) => {

    const [commands, setCommands] = useState([]);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUsersByCommand, setSelectedUsersByCommand] = useState({});
    

    const fetchCommands = async () => {
        try {
            const res = await fetch('/api/commands');
            if (!res.ok) throw new Error('Failed to fetch commands');

            const { data } = await res.json();
            
            setCommands(data || []);
        } catch (err) {
            console.error('Error fetching commands:', err);
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

    const approveCard = async (commandId, selectedUserId) => {
        try {
            const res = await fetch('/api/cards/trigger-approval', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commandId, userId: selectedUserId }),
            });

            const data = await res.json();

            if (res.ok && data && data.success) {
                alert('Card approved successfully!');
                fetchCommands(); // Refresh the list after approval
                if (onCardApproved) onCardApproved();
                setSelectedUsersByCommand((prev) => ({ ...prev, [commandId]: '' }));
            } else {
                alert(data.error || 'Failed to approve card');
            }
        } catch (err) {
            console.error(err);
            alert('Network error while approving card');
        }
    };



    useEffect(() => {
        fetchCommands();
        fetchUsers();
    }, []);

    return (
        <div>
            <h3>Pending Cards</h3>
            <ul className="cards-list">
                {commands.map((command) => (
                    <li key={command._id}> 
                        <strong>Card Mac:</strong> {command.data.mac || 'N/A'} | 
                        <strong>Card Hex:</strong> {command.data.cardHex || 'N/A'}
                        <select
                            value={selectedUsersByCommand[command._id] || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedUsersByCommand((prev) => ({ ...prev, [command._id]: value }));
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
                            onClick={() => approveCard(command._id, selectedUsersByCommand[command._id])}
                            disabled={!selectedUsersByCommand[command._id]}
                        >
                            Approve
                        </button>
                    </li>
                ))}
            </ul>

        </div>
    );

}

export default PendingCards;