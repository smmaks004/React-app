import React, { useEffect, useState } from 'react';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';

import './Cards.css';

import CreateCard from '../card/CreateCard';



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

    useEffect(() => {
        fetchCards();
    }, []);

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Cards Page</h2>

            <CreateCard />
            
            <ul className="cards-list">
                {cards.map((card) => (
                    <li key={card._id}>
                        <strong>Card Name: </strong> {card.name} <strong>Hex:</strong> {card.cardHex}  | 
                        <strong>User:</strong> {
                        card.userId ? `${card.userId.name} 
                        ${card.userId.surname} 
                        (${card.userId.email})` : 'No user'}
                    </li>
                ))}
            </ul>

        </div>
    );

}

export default Cards;