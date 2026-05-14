import { User } from '../models/user.js';

class UsersService {
    
    // GET
    static async getAllUsers() {
        const users = await User.find();
        return users;
    }

    static async getUserByEmail(email) {
        const user = await User.findOne({ email });

        return user;
    }

    // UPDATE
    static async updateUserById( id, name, surname, email, company ) {
        const user = await User.findByIdAndUpdate(
            id,
            { name, surname, email, company },
            { new: true }
        );

        return user;
    }

    // CREATE
    static async createUser( name, surname, email, role, password, company ) {
        const user = new User({ name, surname, email, role, password, company });
        await user.save();

        return user;
    }

    // DELETE
    static async deleteUserById(id) {
        const user = await User.findByIdAndDelete({ _id: id });

        return user;
    }

}

export default UsersService;