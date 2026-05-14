import express from 'express';

// import { User } from '../models/user.js';
import UsersService from '../services/UsersService.js';

const router = express.Router();




// GET /public-users
router.get('/', async (req, res) => {
	// try {
	// 	const users = await User.find();
	// 	res.json(users.map(u => ({ name: u.name, surname: u.surname, email: u.email })));
	// } catch (err) {
	// 	res.status(500).json({ error: err.message });
	// }

	try {
		const allUsers = await UsersService.getAllUsers();
		const response = {
			status: "success",
			message: "All users",
			data: allUsers,
		}

		const { data } = response;
		res.json(data.map(u => ({ name: u.name, surname: u.surname, email: u.email })));

		// res.json(response);
	} catch (err) {
		console.log(err);
		const response = {
			status: "error", 
			message: err.message,
			data: null
		}

		res.status(500).json(err.message);
	}
});




export default router;
