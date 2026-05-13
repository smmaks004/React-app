import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Define Card schema
const cardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Card = mongoose.models.Card || mongoose.model('Card', cardSchema);

// Create a new card for a user
router.post('/create', async (req, res) => {
    const { name, userId } = req.body;

    if (!name || !userId) {
        return res.status(400).json({ message: 'Card name and userId are required' });
    }

    try {
        const card = new Card({ name, userId });
        await card.save();
        res.status(201).json({ message: 'Card created successfully', card });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get all cards for a specific user
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const cards = await Card.find({ userId });
        res.status(200).json(cards);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

export default router;