import { Finger } from '../models/finger.js';

class FingersService {
    // GET
    static async getAllFingers() {
        const fingers = await Finger.find()
            .populate('userId', 'name surname email');
        return fingers;
    }

    static async getFingerById({ fingerId }) {
        const finger = await Finger.findById(fingerId);
        return finger;
    }

    static async getFingerByTemplateData({ templateData }) {
        const finger = await Finger.findOne({ templateData });
        return finger;
    }

    //DELETE
    static async deleteFingerById({ fingerId }) {
        const deletedFinger = await Finger.findByIdAndDelete(fingerId);
        return deletedFinger;
    }

    //CREATE
    static async createFinger({ userId, templateData, type }) {
        const newFinger = await Finger.create({ userId, templateData, type });
        return newFinger;
    }

}


export default FingersService;
