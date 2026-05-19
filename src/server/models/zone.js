import mongoose from 'mongoose';

const zoneSchema = new mongoose.Schema({
    name: String,
    workStart: String,
    workEnd: String,
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
});

export const Zone = mongoose.models.Zone || mongoose.model('Zone', zoneSchema);