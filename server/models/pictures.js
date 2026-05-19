import mongoose from 'mongoose';

const pictureSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    goal: { type: String },
    base64: { type: String, required: true  }
});

export const Picture = mongoose.models.Picture || mongoose.model('Picture', pictureSchema);