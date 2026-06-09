import { Card } from '../models/card.js';

class CardsService {
    
    // GET
    static async getAllCards() {
        const cards = await Card.find({ userId: { $ne: null } })
            .populate('userId', 'name surname email');
        return cards;
    }

    static async getAllPendingCards() {
        const cards = await Card.find({ cardHex: { $exists: true }, userId: null }) // , userId: null
            .populate('userId', 'name surname email');
        return cards;
    }

    static async getAllCardsByUserId({ userId } = {}) {
        const cards = await Card.find(userId ? { userId } : {});
        return cards;
    }
    
    // static async getCardByHex(cardHex) {
    //     if (!cardHex) return null;
    //     const hex = cardHex.startsWith('0x') ? cardHex : `0x${cardHex}`; //
    //     const card = await Card.findOne({ cardHex: hex })
    //         .populate('userId', 'name surname email');
    //     return card;
    // }
    
    static async getCardById(cardId) {
        const card = await Card.findById(cardId);
        return card;
    }
    

    // CREATE
    static async createCard({ name, userId = null, cardHex, type }) {
        const card = await Card.create({ name, userId, cardHex, type });
        await card.save();
        
        return card;
    }   

    // DELETE
    static async deleteCardById({ cardId }) {
        const deleted = await Card.findByIdAndDelete({ _id: cardId });
        
        return deleted;
    }

    // static async deleteCardByHex({ cardHex }) {
    //     const deleted = await Card.findOneAndDelete({ cardHex: cardHex });
        
    //     return deleted;
    // }


    // DELETE
    static async updateCardUser({ cardId, userId }) {
        const updatedCard = await Card.findByIdAndUpdate(
            { _id: cardId },
            { userId: userId },
            { new: true }
        );
        return updatedCard;
    }


}

export default CardsService;