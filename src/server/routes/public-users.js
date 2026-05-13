import express from 'express';
import { User } from '../models/user.js';

const router = express.Router();




// GET /public-users
router.get('/', async (req, res) => {
	try {
		const users = await User.find();
		res.json(users.map(u => ({ name: u.name, surname: u.surname, email: u.email })));
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});




export default router;
