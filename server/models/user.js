import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	name: String,
	surname: String,
	email: String,
	password: String,
	role: { type: String, default: 'user' },
	token: String,
	company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);