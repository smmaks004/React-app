import { Card } from '../models/card.js';

class CardsService {
    
    // GET
    static async getAllCards() {
        const cards = await Card.find()
            .populate('userId', 'name surname email');
        return cards;
    }

    static async getAllCardsByUserId({ userId } = {}) {
        const cards = await Card.find(userId ? { userId } : {});
        return cards;
    }
    
    
    // CREATE
    static async createCard({ name, userId, cardHex }) {
        const card = await Card.create({ name, userId, cardHex });
        await card.save();
        
        return card;
    }   

}

export default CardsService;