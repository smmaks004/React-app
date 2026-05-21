import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



    
const CardsListForUser = ({ managingCardsUser, setManagingCardsUser }) => {

    const [cards, setCards] = useState([]); // State for user's cards

    // New values states
    const [newCardName, setNewCardName] = useState(''); // State for new card input
    const [newCardHex, setNewCardHex] = useState(''); // State for new card hex input


    // Fetchers
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


    // Handlers
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




    return (
        <div>
            {/* <h3>Manage Cards for {managingCardsUser.name}</h3> */}
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
                    placeholder="0xA1B2xC3"
                />
                <button onClick={handleAddCard}>Add Card</button>
                <button onClick={() => setManagingCardsUser(null)}>Close</button>
            </div>
        </div>

    );
}



export default CardsListForUser;