import { Card } from '../models/card.js';

class CardsService {
    
    // GET
    static async getAllCards() {
        const cards = await Card.find();
        return cards;
    }
    
    
    // CardsService.createCard( name, userId ) 
    // CardsService.createCard( userId, name ) 
    // CREATE
    static async createCard( name, userId ) {
        const card = await Card.create({ name, userId });
        await card.save();
        
        return card;
    }   
    // CardsService.createCard({ name, userId} ) 
    // CardsService.createCard({ name: "Arturs", userId: '1231"} ) 
    // CardsService.createCard( {userId, name} ) 
    //    static async createCard2({ name, userId } ) {
    //     const card = await Card.create({ name, userId });
    //     await card.save();
        
    //     return card;
    // }

}

export default CardsService;