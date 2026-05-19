import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cardHex: { type: String },
});

export const Card = mongoose.models.Card || mongoose.model('Card', cardSchema);