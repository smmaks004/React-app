import express from 'express';
import mongoose from 'mongoose';


import CardsServices from '../services/CardsService.js';
import UsersServices from '../services/UsersService.js';

// import { Card } from '../models/card.js';



const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const allCards = await CardsServices.getAllCards();
        const response = {
            status: "success",
            message: "All cards with users info",
            data: allCards,
        }

        console.log(response);
        res.json(response);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

});



// Create a new card for a user
router.post('/create', async (req, res) => {
    const { name, userId , cardHex, type} = req.body;

    if (!name || !userId) {
        return res.status(400).json({ message: 'Card name and userId are required' });
    }

    try {
        // const card = new Card({ name, userId });
        // await card.save();
        const card = await CardsServices.createCard({ name, userId, cardHex, type });
        const response = {
            status: "success",
            message: "Card created",
            data: card,
        }

        res.json(response);
        // res.status(201).json({ message: 'Card created successfully', card });
    } catch (err) {
        const response = {
            status: "error",
            message: err.message,
            data: null
        }

        res.status(500).json(response);
    }
});

// Get all cards for a specific user
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // const cards = await Card.find({ userId });
        const cards = await CardsServices.getAllCardsByUserId({ userId });
        const response = {
            status: "success",
            message: "User's cards",
            data: cards,
        }

        res.json(response);
        // res.status(200).json(cards);
    } catch (err) {
        const response = {
            status: "error",
            message: err.message,
            data: null
        }
        
        res.status(500).json(response);
    }
});



router.delete('/delete/:cardId', async (req, res) => {
    const { cardId } = req.params;
    console.log('(Console) Delete request for cardId:', cardId);
    try {
        const cardToDelete = await CardsServices.getCardById(cardId);
        if (!cardToDelete) {
            return res.status(404).json({ message: 'Card not found' });
        }

        activeDeleteSession = {
            isDeleting: true,
            cardHex: cardToDelete.cardHex,
            status: 'pending_device_pickup'
        };

        const deletedCard = await CardsServices.deleteCard(cardId);
        if (!deletedCard) {
            return res.status(404).json({ message: 'Card not found' });
        }

        res.json({ message: 'Card deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/trigger-scan', async (req, res) => {
    const { userId } = req.body; 

    // Set the global variable to indicate someone is waiting to scan
    activeScanSession = {
        isScanning: true,
        userId: userId,
        status: 'pending_device_pickup'
    };

    res.json({ message: 'Server is ready. Please swipe the card on the controller now.' });

});



export default router;