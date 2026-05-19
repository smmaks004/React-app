import { Token } from '../models/token.js';

class TokenService {

    // GET 
    static async getTokenByUserId({ userId }){
        return await Token.findOne({ userId });
    }

    // UPDATE
    static async updateTokenByUserId({ userId, token }){
        await Token.findOneAndUpdate({ userId }, { token, createdAt: new Date() }, { upsert: true, new: true });
    }

}

export default TokenService;