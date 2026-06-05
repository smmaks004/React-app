import mongoose from 'mongoose';

const fingerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    templateData: { type: String },
    type: { type: String, default: 'Finger', required: true  },
    createAt: { type: Date, default: Date.now }
});

export const Finger = mongoose.models.Finger || mongoose.model('Finger', fingerSchema);