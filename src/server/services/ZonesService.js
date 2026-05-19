import { Zone } from '../models/zone.js';
import { UsersZones } from '../models/many-to-many/usersZones.js';

class ZonesService {
    
    // GET
    static async getAllZones() {
        const zones = await Zone.find().populate('companyId', 'name');

        return zones;
    }

    static async getZonesByUserId({ userId }) {
        const userZones = await UsersZones.find({ userId })
            .populate({
                path: 'zoneId',
                populate: {
                    path: 'companyId',
                    select: 'name',
                },
            });

        return userZones
            .map(({ zoneId }) => zoneId)
            .filter(Boolean);
    }


    // CREATE
    static async createZone({ name, workStart, workEnd, companyId, userId }) {
        const zone = new Zone({ name, workStart, workEnd, companyId });
        await zone.save();

        if (userId) {
            await UsersZones.create({ userId, zoneId: zone._id });
        }

        return zone;
    }


    static async assignZoneToUser({ userId, zoneId }) {
        const existingLink = await UsersZones.findOne({ userId, zoneId });

        if (existingLink) {
            return existingLink;
        }

        return UsersZones.create({ userId, zoneId });
    }

}

export default ZonesService;