import express from 'express';
import bcrypt from 'bcryptjs';

import { User } from '../models/user.js';
import UsersService from '../services/UsersService.js';

const router = express.Router();
// import { Company } from '/companies.js';

// GET all users
router.get('/', async (req, res) => {
	const { body } = req;
	try {
		const data = await UsersService.getAllUsers();
		const response = {
			status: "success", // success / error
			message: "Message", // info message about request
			data, // all data for front-end
		}
		res.json(response);
	} catch (err) {
		console.log(err);
		const response = {
			data: null, // all data for front-end
			status: "error", // success / error
			message: err.message // info message about request
		}
		res.status(500).json(response);
	}
});


// Create user
router.post('/create', async (req, res) => {
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




// Update a user
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, surname, email, company } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
			id,
			{ name, surname, email, company },
			{ new: true }
		);
		if (!updatedUser) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.json({ message: 'User updated', user: { name, surname, email, company } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Delete a user
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});





export default router;
