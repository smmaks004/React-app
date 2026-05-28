import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



    
const CardsListForUser = ({ managingCardsUser, reloadKey }) => {

    const [cards, setCards] = useState([]); // State for user's cards

    


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

    useEffect(() => {
        if (managingCardsUser?._id) {
            fetchCards(managingCardsUser._id);
        }
    }, [managingCardsUser, reloadKey]);


    




    return (
        <div>
            <h3>Manage Cards for {managingCardsUser.name}</h3>
            <ul className="cards-list">
                {cards.map((card) => (
                    <li key={card._id}><strong>Name: </strong> {card.name} <strong>Hex:</strong> {card.cardHex}</li>
                ))}
            </ul>
        </div>

    );
}



export default CardsListForUser;