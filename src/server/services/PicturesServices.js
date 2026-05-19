import { Picture } from '../models/pictures.js';

class PicturesService {
    
    // GET
    static async getUserProfilePicture({ userId, goal } = {}) {
        const picture = await Picture.findOne({ userId: userId, goal: 'profile' });
        
        return picture;
    }

    // CREATE or UPDATE
    static async upsertPictureByUserId({ userId, goal, base64 }) {
        const picture = await Picture.findOneAndUpdate(
            { userId },
            { userId, goal, base64 },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return picture;
    }


}

export default PicturesService;