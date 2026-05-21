import express from 'express';

import CardsService from '../services/CardsService.js';

const router = express.Router();


router.get('/online', (req, res) => {
    console.log('--- /online received ---');
    console.log(req.url);
    const { mac, src, scanType, trsn } = req.query;

    console.log("Transaction data", trsn)
});
router.post('/data/collect', (req, res) => {
	console.log('--- /collect received ---');
	console.log('From IP:', req.ip);
	console.log('Headers:', req.headers);
	console.log('Body:', req.body);

	res.json({ received: true, timestamp: new Date().toISOString() });
});


// ////
router.post('/data/addAuthData', async (req, res) => {
    console.log('--- Received New Auth Data ---');
    console.log(req.body);

    const { mac, scanType, userId, cardHex, templateData } = req.body;
    
    try {
        // Card
        if (scanType === 1) {
            const hex = cardHex && cardHex.startsWith('0x') ? cardHex : (cardHex ? `0x${cardHex}` : null); //
            if (!hex) {
                console.log('No cardHex provided in payload');
            } else {
                const existing = await CardsService.getCardByHex(hex);
                if (existing) {
                    console.log(`Card exists in DB: ${hex} for user ${existing.userId ? existing.userId._id : 'unknown'}`);
                    if (userId && existing.userId && existing.userId._id.toString() !== userId.toString()) {
                        console.log(`Warning: card ${hex} appears to belong to different user ${existing.userId._id}`);
                    }
                } else {
                    if (userId) {
                        const name = `Card ${hex.slice(-6)}`;
                        const created = await CardsService.createCard({ name, userId, cardHex: hex, type: 'Card' });
                        console.log(`Created new card ${created._id} (${hex}) for user ${userId}`);
                    } else {
                        console.log(`Card ${hex} not found and no userId provided; skipping create.`);
                    }
                }
            }
        }
        // Fingerprint
        else if (scanType === 2) {
            console.log(`Saving new FINGERPRINT template for User ${userId}`);
        }
        // Face
        else if (scanType === 3) {
            console.log(`Saving new FACE template for User ${userId}`);
        }

        // The hardware strictly expects this exact JSON object response
        return res.json({ success: true });
    } catch (err) {
        console.error('Error handling addAuthData:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
