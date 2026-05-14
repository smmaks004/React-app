import React, { useEffect, useState } from 'react';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import CreateUser from './CreateUser';
// import { unwrapListResponse } from '../../utils/response';


import './Users.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]); // State for companies
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [managingCardsUser, setManagingCardsUser] = useState(null); // State for managing cards
    const [cards, setCards] = useState([]); // State for user's cards
    const [newCardName, setNewCardName] = useState(''); // State for new card input

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

    const handleAddCard = async () => {
        if (!newCardName.trim()) return;

        try {
            const response = await fetch('/api/cards/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newCardName, userId: managingCardsUser._id }),
            });

            if (response.ok) {
                fetchCards(managingCardsUser._id);
                setNewCardName('');
            } else {
                console.error('Failed to add card');
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
                        {user.name} {user.surname} ({user.email})
                        <button onClick={() => handleEdit(user)}>Edit</button>
                        <button onClick={() => handleDelete(user._id)}>Delete</button>
                        <button onClick={() => handleManageCards(user)}>Manage Cards</button>
                    </li>
                ))}
            </ul>

            {managingCardsUser && (
                <div className="modal">
                    <h3>Manage Cards for {managingCardsUser.name}</h3>
                    <ul className="cards-list">
						{cards.map((card) => (
							<li key={card._id}>Name: {card.name}</li>
						))}
					</ul>
                    <div>
                        <label>New Card:</label>
                        <input
                            type="text"
                            value={newCardName}
                            onChange={(e) => setNewCardName(e.target.value)}
                        />
                        <button onClick={handleAddCard}>Add Card</button>
                        <button onClick={() => setManagingCardsUser(null)}>Close</button>
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
