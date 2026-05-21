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
    
    static async getCardByHex(cardHex) {
        if (!cardHex) return null;
        const hex = cardHex.startsWith('0x') ? cardHex : `0x${cardHex}`; //
        const card = await Card.findOne({ cardHex: hex })
            .populate('userId', 'name surname email');
        return card;
    }
    
    
    // CREATE
    static async createCard({ name, userId, cardHex, type }) {
        const card = await Card.create({ name, userId, cardHex, type });
        await card.save();
        
        return card;
    }   

}

export default CardsService;