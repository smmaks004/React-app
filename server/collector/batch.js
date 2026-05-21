import express from 'express';
import CardsService from '../services/CardsService.js';

const router = express.Router();




router.post('/data/addAuthData', (req, res) => {
	console.log('--- New Auth Data Received (Finger/Face/Card) ---');
	console.log('Body:', req.body);

	res.json({ success: true });
});


router.get('/data/getUsersSync', async (req, res) => {
	try {
		const { meta, type } = req.query;

		// 1. Hardware checks sync metadata counts first
		if (meta === '1') {
			const cards = await CardsService.getAllCards();
			const cardsTotalCount = String(cards.length || 0);

			return res.json({
				cardsTotalCount,
				cardsPageCount: 1,
				cardsPageSize: 200,
				fingersTotalCount: "0",
				fingersPageCount: 0,
				fingersPageSize: 20,
				facesPageCount: 0,
				facesTotalCount: 0,
				facesPageSize: 10
			});
		}

		// 2. Hardware requests actual data pages based on type (1 = Cards)
		if (type === '1') {
			const cards = await CardsService.getAllCards();
			const mapped = cards.map(c => {
				const hex = c.cardHex && c.cardHex.startsWith('0x') ? c.cardHex : `0x${c.cardHex}`;
				const owner = c.userId ? `${c.userId.name || ''} ${c.userId.surname || ''}`.trim() : (c.name || '');

				return {
					uid: hex,
					data: hex,
					name: owner || c.name || '',
					type: 1,
					image: null,
					len: null
				};
			});

			return res.json(mapped);
		}

		// Return empty array for fingers (type 2) or faces (type 3) if there are no pages
		return res.json([]);
	} catch (err) {
		console.error('Error in getUsersSync:', err);
		return res.status(500).json({ error: 'Server error' });
	}
});


// router.get('/batch/:deviceUid/:eventData', (req, res) => {
// 	console.log(`\n--- SUCCESSFUL CARD SWIPE DETECTED ---`);
// 	console.log(`Request URL   : ${req.originalUrl}`);
// 	const [rawTimestamp, direction, statusCode, credentialId] = req.params.eventData.split(',');
// 	console.log(`Card Number   : ${credentialId}`); 
// 	console.log(`Direction     : ${direction === '1' ? 'IN' : 'OUT'}`);
// 	console.log(`Status Code   : ${statusCode}`);
// 	console.log(`Timestamp(UTC): ${rawTimestamp}\n`);
// 	res.type('text/plain').send('ok');
// });



export default router;
