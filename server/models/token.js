import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	token: String,
	createdAt: { type: Date, default: Date.now, expires: '1h' },
});

export const Token = mongoose.models.Token || mongoose.model('Token', tokenSchema);