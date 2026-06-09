import { Finger } from '../models/finger.js';

class FingersService {
    // GET
    static async getAllFingers() {
        const fingers = await Finger.find({ userId: { $ne: null } })
            .populate('userId', 'name surname email');
        return fingers;
    }

    static async getAllPendingFingers() {
        const fingers = await Finger.find({ templateData: { $exists: true }, userId: null }) // , userId: null
            .populate('userId', 'name surname email');
        return fingers;
    }

    static async getFingerById(fingerId) {
        const finger = await Finger.findById(fingerId);
        return finger;
    }

    static async getFingerByTemplateData({ templateData }) {
        const finger = await Finger.findOne(templateData);
        return finger;
    }

    //DELETE
    static async deleteFingerById({ fingerId }) {
        const deletedFinger = await Finger.findByIdAndDelete(fingerId);
        return deletedFinger;
    }

    //CREATE
    static async createFinger({ userId, templateData, type }) {
        // const newFinger = await Finger.create({ userId, templateData, type });
        const newFinger = await Finger.create({ userId, templateData, type });

        return newFinger;
    }

    // UPDATE
    static async updateFingerUser({ fingerId, userId }) {
        const updatedFinger = await Finger.findByIdAndUpdate(
            { _id: fingerId },
            { userId: userId },
            { new: true } // Return the updated document, not the original
        );
        return updatedFinger;
    }

}


export default FingersService;
