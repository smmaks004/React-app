import { User } from '../models/user.js';

class UsersService {
    
    // Get all users
    static async getAllUsers() {
        const users = await User.find();
        return users;
    }

    static async getUserByEmail(email) {
        const user = await User.findOne({ email });
        return user;
    }

}

export default UsersService;