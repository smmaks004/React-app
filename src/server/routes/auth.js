import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { authenticateToken } from '../middleware/middleware.js';

// import { User } from '../models/user.js';
// import { Token } from '../models/token.js';

import UsersService from '../services/UsersService.js';
import TokenService from '../services/TokensService.js';

// import { User } from './users.js';


const router = express.Router();


dotenv.config();


// Middleware to parse cookies
router.use(cookieParser());

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
        
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }
    try {
        // const user = await User.findOne({ email });
        const user = await UsersService.getUserByEmail({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password**' });
        }

        

        const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        await TokenService.updateTokenByUserId({ userId: user._id, token });
        
        res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false });
        
        
        const response = {
            status: "success",
            message: "Login successful",
            data: {
                token,
                user,
            }
        }
        res.json(response);
        // res.json({ message: 'Login successful', user: { email: user.email, name: user.name } });
    } catch (err) {
        console.log(err);
        const response = {
            status: "error",
            message: "Tried to login but failed: " + err.message,
            data: null
        }
        
        res.status(500).json(response);
        // res.status(500).json({ message: 'Server error', error: err.message });
    }
});



// Self registration, same as user creation
router.post('/registration', async (req, res) => {
    console.log('Registration data:', req.body);

    const { name, surname, email, role, password, company } = req.body;
    if (!name || !surname || !email || !password) {
        return res.status(400).json({ message: 'Name, surname, email, and password are required' });
    }
    
    try {
        const existing = await UsersService.getUserByEmail({ email });
        if (existing) {
            return res.status(409).json({ message: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        // const user = new User({ name, surname, email, role, password: hashedPassword, company });
        const user = await UsersService.createUser({ name, surname, email, role, password: hashedPassword, company });


        // await user.save();
    
        res.status(201).json({
            status: 'success',
            message: 'User created',
            data: { name, surname, email, company },
        });
    } catch (err) {
        console.log(err);
        const response = {
            status: "error",
            message: "Tried to register but failed: " + err.message,
            data: null
        }
        
        res.status(500).json(response);

        // res.status(500).json({ message: 'Server error', error: err.message });
    }
});





// Route to check if user is authenticated // !!!
router.get('/status', authenticateToken, (req, res) => {
    res.json({ loggedIn: true, user: req.user });
});

// Logout route
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

export default router;
