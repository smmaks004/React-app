import express from 'express';
import mongoose from 'mongoose';


import CardsServices from '../services/CardsService.js';
// import { Card } from '../models/card.js';



const router = express.Router();

// Create a new card for a user
router.post('/create', async (req, res) => {
    const { name, userId } = req.body;

    if (!name || !userId) {
        return res.status(400).json({ message: 'Card name and userId are required' });
    }

    try {
        // const card = new Card({ name, userId });
        // await card.save();
        const card = await CardsServices.createCard( name, userId );
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
        const cards = await CardsServices.getAllCards( userId );
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

export default router;