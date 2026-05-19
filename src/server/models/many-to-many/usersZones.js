import mongoose from 'mongoose';

const usersZonesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' }
});

export const UsersZones = mongoose.models.UsersZones || mongoose.model('UsersZones', usersZonesSchema);