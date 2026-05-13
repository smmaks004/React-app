import express from 'express';
import { User } from '../models/user.js';
import { Token } from '../models/token.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authenticateToken } from '../middleware/middleware.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

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
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password**' });
        }


        const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });


        // todo: add token save to database, 1 token to 1 user.
        // await User.updateOne({ _id: user._id }, { $set: { token: token } });
        await Token.findOneAndUpdate({ userId: user._id }, { token, createdAt: new Date() }, { upsert: true, new: true });


        res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false });
        res.json({ message: 'Login successful', user: { email: user.email, name: user.name } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
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
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, surname, email, role, password: hashedPassword, company });

        await user.save();
        res.status(201).json({ message: 'User created', user: { name, surname, email, company } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
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
