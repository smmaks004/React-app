import React, { useEffect, useState } from 'react';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';

import './Cards.css';


const PendingCards = ({ onCardApproved }) => {

    // const [commands, setCommands] = useState([]);
    const [cards, setCards] = useState([]);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    // const [selectedUsersByCommand, setSelectedUsersByCommand] = useState({});
    
    const [selectedUsersByCard, setSelectedUsersByCard] = useState({});
    

    // const fetchCommands = async () => {
    //     try {
    //         const res = await fetch('/api/commands/cards');
    //         if (!res.ok) throw new Error('Failed to fetch commands');

    //         const { data } = await res.json();
            
    //         setCommands(data || []);
    //     } catch (err) {
    //         console.error('Error fetching commands:', err);
    //         setError(err.message);
    //     }
    // };

    const fetchPendingCards = async () => {
        try {
            const res = await fetch('/api/cards/pending');
            if (!res.ok) throw new Error('Failed to fetch pending cards');

            const { data } = await res.json();
            
            setCards(data || []);
        } catch (err) {
            console.error('Error fetching pending cards:', err);
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

    // const approveCard = async (commandId, selectedUserId) => {
    //     try {
    //         const res = await fetch('/api/cards/trigger-approval', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ commandId, userId: selectedUserId }),
    //         });

    //         const data = await res.json();

    //         if (res.ok && data && data.success) {
    //             alert('Card approved successfully!');
    //             fetchPendingCards(); // Refresh the list after approval
    //             if (onCardApproved) onCardApproved();
    //             setSelectedUsersByCommand((prev) => ({ ...prev, [commandId]: '' }));
    //         } else {
    //             alert(data.error || 'Failed to approve card');
    //         }
    //     } catch (err) {
    //         console.error(err);
    //         alert('Network error while approving card');
    //     }
    // };

    const approveCard = async (cardId, selectedUserId) => {
        try {
            const res = await fetch('/api/cards/trigger-approval', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardId, userId: selectedUserId }),
            });

            const data = await res.json();

            if (res.ok && data && data.success) {
                alert('Card approved successfully!');
                fetchPendingCards(); // Refresh the list after approval
                if (onCardApproved) onCardApproved();
                setSelectedUsersByCard((prev) => ({ ...prev, [cardId]: '' }));
            } else {
                alert(data.error || 'Failed to approve card');
            }
        } catch (err) {
            console.error(err);
            alert('Network error while approving card');
        }
    };



    useEffect(() => {
        fetchPendingCards();
        fetchUsers();
    }, []);

    return (
        <div>
            <h3>Pending Cards</h3>
            <ul className="cards-list">
                {cards.map((card) => (
                    <li key={card._id}> 
                        <strong>Card ID:</strong> {card._id} |
                        <strong>Card Hex:</strong> {card?.cardHex || 'N/A'} |

                        <select
                            value={selectedUsersByCard[card._id] || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedUsersByCard((prev) => ({ ...prev, [card._id]: value }));
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
                            onClick={() => approveCard(
                                card._id, 
                                selectedUsersByCard[card._id]
                            )}
                            disabled={!selectedUsersByCard[card._id]}
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