import express from 'express';

const router = express.Router();

router.get('/data/getControllers', (req, res) => {
	console.log('--- Controller List Requested ---');

	res.json([
		{
			deviceUid: '544183018',
			title: 'Suprema BioEntry W2 200.120',
			object_id: '1',
			lastLogId: '12354',
			direction: '0',
			masterCardHex: null,
		},
	]);
});

export default router;
