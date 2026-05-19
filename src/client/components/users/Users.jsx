import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CreateUser from './CreateUser';

import './Users.css';

const Users = () => {
    // Arrays amd states
    const [cards, setCards] = useState([]); // State for user's cards
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]); // State for companies
    const [zones, setZones] = useState([]); // State for user's zones
    const [allZones, setAllZones] = useState([]); // State for available zones

    // States
    const [showModal, setShowModal] = useState(false);
    const [managingCardsUser, setManagingCardsUser] = useState(null); // State for managing cards
    const [managingZonesUser, setManagingZonesUser] = useState(null); // State for managing zones
    const [selectedZoneId, setSelectedZoneId] = useState('');

    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    
    // New Object states
    const [newCardName, setNewCardName] = useState(''); // State for new card input
    const [newCardHex, setNewCardHex] = useState(''); // State for new card hex input

    // Fetchs
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

    const fetchCompanies = async () => {
        try {
            const res = await fetch('/api/companies/companies-names');
            if (!res.ok) throw new Error('Failed to fetch companies');
            const { data } = await res.json();
            setCompanies(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchAllZones = async () => {
        try {
            const res = await fetch('/api/zones');
            if (!res.ok) throw new Error('Failed to fetch zones');
            const { data } = await res.json();
            setAllZones(data);
        } catch (err) {
            console.error('Error fetching all zones:', err);
        }
    };

    const fetchCards = async (userId) => {
        try {
            const res = await fetch(`/api/cards/user/${userId}`);
            if (!res.ok) throw new Error('Failed to fetch cards');
            const { data } = await res.json();
            setCards(data);
        } catch (err) {
            console.error('Error fetching cards:', err);
        }
    };

    const fetchZones = async (userId) => {
        try {
            const res = await fetch(`/api/zones/user/${userId}`);
            // if (!res.ok) throw new Error('Failed to fetch zones');
            const { data } = await res.json();
            setZones(data);
        } catch (err) {
            console.error('Error fetching zones:', err);
        }
    };

    // Handlers
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/users/delete/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchUsers();
            } else {
                console.error('Failed to delete user');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const handleManageCards = (user) => {
        setManagingCardsUser(user);
        fetchCards(user._id);
    };

    const handleManageZones = (user) => {
        setManagingZonesUser(user);
        fetchZones(user._id);
        fetchAllZones();
        setSelectedZoneId('');
    };

    const handleAddCard = async () => {
        if (!newCardName.trim() || !newCardHex.trim()) return;

        try {
            const response = await fetch('/api/cards/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newCardName,
                    userId: managingCardsUser._id,
                    cardHex: newCardHex
                }),
            });

            if (response.ok) {
                fetchCards(managingCardsUser._id);
                setNewCardName('');
                setNewCardHex('');
            } else {
                console.error('Failed to add card');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleAddZone = async () => {
        if (!selectedZoneId || !managingZonesUser) return;

        try {
            const response = await fetch('/api/zones/assign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    zoneId: selectedZoneId,
                    userId: managingZonesUser._id,
                }),
            });

            if (response.ok) {
                fetchZones(managingZonesUser._id);
                setSelectedZoneId('');
            } else {
                console.error('Failed to add zone');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingUser(null);
    };

    const handleModalSave = async (updatedUser) => {
        try {
            const response = await fetch(`/api/users/update/${updatedUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (response.ok) {
            // if (response.status === "success") {
                fetchUsers();
                handleModalClose();
            } else {
                console.error('Failed to update user');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchCompanies(); // Fetch companies on component mount
    }, []);

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <CreateUser onUserCreated={fetchUsers} />
            <h2>Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user._id}>
                        {user.name} {user.surname} |  <strong>Email:</strong> {user.email}
                        <button onClick={() => handleEdit(user)}>Edit</button>
                        <button onClick={() => handleManageCards(user)}>Manage Cards</button>
                        <button onClick={() => handleManageZones(user)}>+ Add Zone</button>

                        <button onClick={() => handleDelete(user._id)}>Delete</button>
                    </li>
                ))}
            </ul>


            {/* Modal for managing user's cards */}
            {managingCardsUser && (
                <div className="modal">
                    <h3>Manage Cards for {managingCardsUser.name}</h3>
                    <ul className="cards-list">
						{cards.map((card) => (
							<li key={card._id}><strong>Name: </strong> {card.name} <strong>Hex:</strong> {card.cardHex}</li>
						))}
					</ul>
                    <div>
                        <label>New Card:</label>
                        <input
                            type="text"
                            value={newCardName}
                            onChange={(e) => setNewCardName(e.target.value)}
                        />
                        <label>Card Hex:</label>
                        <input
                            type="text"
                            value={newCardHex}
                            onChange={(e) => setNewCardHex(e.target.value)}
                            placeholder="#A1B2C3"
                        />
                        <button onClick={handleAddCard}>Add Card</button>
                        <button onClick={() => setManagingCardsUser(null)}>Close</button>
                    </div>
                </div>
            )}

            {managingZonesUser && (
                <div className="modal">
                    <h3>Manage Zones for {managingZonesUser.name}</h3>
                    <ul className="zones-list">
                        {zones.map((zone) => (
                            <li key={zone._id}><strong>Name: </strong> {zone.name}</li>
                        ))}
                    </ul>
                    <div>
                        <label>Select zone:</label>
                        <select value={selectedZoneId} onChange={(e) => setSelectedZoneId(e.target.value)}>
                            <option value="">-- Select zone --</option>
                            {allZones.map((zone) => (
                                <option key={zone._id} value={zone._id}>
                                    {zone.name}
                                </option>
                            ))}
                        </select>

                        <button onClick={handleAddZone}>Add Zone</button>
                        <button
                            onClick={() => {
                                setManagingZonesUser(null);
                                setSelectedZoneId('');
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Modal part for editing user */}
            {showModal && (
                <div className="modal">
                    <h3>Edit User</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleModalSave(editingUser);
                        }}
                    >
                        <div>
                            <label>Name:</label>
                            <input
                                type="text"
                                value={editingUser.name}
                                onChange={(e) =>
                                    setEditingUser({ ...editingUser, name: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label>Surname:</label>
                            <input
                                type="text"
                                value={editingUser.surname}
                                onChange={(e) =>
                                    setEditingUser({ ...editingUser, surname: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={editingUser.email}
                                onChange={(e) =>
                                    setEditingUser({ ...editingUser, email: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label>Company:</label>
                            <select
                                value={editingUser.company || ''}
                                onChange={(e) =>
                                    setEditingUser({ ...editingUser, company: e.target.value })
                                }
                            >
                                <option value="">Select a company</option>
                                {companies.map((company) => (
                                    <option key={company._id} value={company._id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit">Save</button>
                        <button type="button" onClick={handleModalClose}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Users;
