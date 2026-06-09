import mongoose from 'mongoose';

// Simple Mongoose Schema to store your hardware jobs
const commandSchema = new mongoose.Schema({
    action: { type: Number, required: true }, // 201 (Scan), 1 (Add), 9 (Delete)
    data: { type: mongoose.Schema.Types.Mixed, default: null },
    status: { type: String, default: '' }, 
    createdAt: { type: Date, default: Date.now },
    sent: { type: Boolean, default: false },
});


export const Command = mongoose.models.Command || mongoose.model('Command', commandSchema);
