import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    name: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cardHex: { type: String },
    type: { type: String, default: 'Card', required: true  }
});

export const Card = mongoose.models.Card || mongoose.model('Card', cardSchema);