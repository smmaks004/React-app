import express from 'express';
import UsersService from '../services/UsersService.js';
import PicturesService from '../services/PicturesServices.js';

const router = express.Router();

// GET all pictures
router.get('/', async (req, res) => {
	// const { body } = req;
	try {
		const allPictures = await UsersService.getAllPictures();
		const response = {
			status: "success", // success / error
			message: "All pictures", // info message about request
			data: allPictures, // all data for front-end
		}

		res.json(response);
	} catch (err) {
		console.log(err);
		const response = {
			status: "error", 
			message: err.message,
			data: null
		}

		res.status(500).json(response);
	}
});


router.post('/change-user-picture', async (req, res) => {
	const { goal, base64 } = req.body;

	if (!base64) {
		return res.status(400).json({
			status: 'error',
			message: 'base64 is required',
			data: null,
		});
	}

	try {
		const dbUser = await UsersService.getUserByEmail({ email: req.user.email });
		if (!dbUser) {
			return res.status(404).json({
				status: 'error',
				message: 'User not found',
				data: null,
			});
		}

		const savedPicture = await PicturesService.upsertPictureByUserId({
			userId: dbUser._id,
			goal: 'profile',
			base64,
		});


		return res.json({
			status: 'success',
			message: 'Picture saved',
			data: savedPicture,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			status: 'error',
			message: err.message,
			data: null,
		});
	}

});


router.get('/user-picture', async (req, res) => {
	try {
		const dbUser = await UsersService.getUserByEmail({ email: req.user.email });
		if (!dbUser) {
			return res.status(404).json({
				status: 'error',
				message: 'User not found',
				data: null,
			});
		}

		const picture = await PicturesService.getUserProfilePicture({ userId: dbUser._id });

		return res.json({
			status: 'success',
			message: 'User picture',
			data: picture,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			status: 'error',
			message: err.message,
			data: null,
		});
	}
});





export default router;
