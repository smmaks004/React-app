import React, { useEffect, useState } from 'react';
// import Header from '../Header';
import { useNavigate } from 'react-router-dom';

import './Cards.css';
import CreateCard from './CreateCard';
import PendingCards from '../card/PendingCards';



const Cards = () => {
    const [cards, setCards] = useState([]);
    const [error, setError] = useState(null);

    const fetchCards = async () => {
        try {
            const res = await fetch('/api/cards');
            if (!res.ok) throw new Error('Failed to fetch cards');
            
            const { data } = await res.json();
            
            setCards(data || []);
        } catch (err) {
            console.error('Error fetching cards:', err);
            setError(err.message);
        }
    };

    const deleteCard = async (cardId) => {
        if (!window.confirm('Are you sure you want to delete this card?')) return;

        try {
            const res = await fetch(`/api/cards/delete/${cardId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete card');
            
            await fetchCards();
        } catch (err) {
            console.error('Error deleting card:', err);
            // alert('Error deleting card: ' + err.message);
        }
    };


    useEffect(() => {
        fetchCards();
    }, []);

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Cards Page</h2>

            {/* Create Card Section */}
            <CreateCard onCardCreated={fetchCards} />

            <PendingCards onCardApproved={fetchCards} />
            
            <h3>All Cards</h3>
            <ul className="cards-list">
                {cards.map((card) => (
                    <li key={card._id}>
                        <strong>Card Name: </strong> {card.name} <strong>Hex:</strong> {card.cardHex}  | 
                        <strong>User:</strong> {
                        card.userId ? `${card.userId.name} 
                        ${card.userId.surname} 
                        (${card.userId.email})` : 'No user'}
                        <button onClick={() => deleteCard(card._id)}>Delete</button>
                    </li>
                ))}
            </ul>

        </div>
    );

}

export default Cards;