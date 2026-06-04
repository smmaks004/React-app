import express from 'express';

import CardsService from '../services/CardsService.js';
import { Command } from '../models/command.js';

const router = express.Router();


// router.get('/online', (req, res) => {
//     console.log('--- /online received ---');
//     console.log(req.url);
//     const { mac, src, scanType, trsn } = req.query;

//     console.log("Transaction data", trsn)
// });

router.get('/online', async (req, res) => {
    console.log('--- /online received ---');
    console.log(req.url);
    const { mac, src, scanType, trsn } = req.query;

    console.log("Transaction data", trsn);
    
    return res.type('text/plain').send('ack=1'); 

    // Force the response header type to plain text so the hardware parses it correctly
    // res.type('text/plain');

    // if (!trsn) {
    //     return res.send('ack=0'); 
    // }

    // try {
    //     const segments = trsn.split(',');
    //     const parsedHex = segments[segments.length - 1]; 

    //     const cardExists = await CardsService.getCardByHex(parsedHex);

    //     if (cardExists) {
    //         console.log(`Access Approved for Hex: ${parsedHex}`);
    //         return res.send('ack=1'); // Will now be delivered cleanly as text/plain
    //     } else {
    //         console.log(`Access Rejected. Hex ${parsedHex} not found in database.`);
    //         return res.send('ack=0'); 
    //     }
    // } catch (err) {
    //     console.error('Error handling online verification check:', err);
    //     res.send('ack=0');
    // }

});



router.post('/data/collect', (req, res) => {
	console.log('--- /collect received ---');
	console.log('From IP:', req.ip);
	console.log('Headers:', req.headers);
	console.log('Body:', req.body);

	res.json({ received: true, timestamp: new Date().toISOString() });
});


//////
router.post('/data/addAuthData', async (req, res) => {
    console.log('--- Received New Auth Data ---');
    console.log(req.body);

    const { mac, cardHex,scanType, userId, templateData } = req.body;
    
    try {
        // Card
        if (scanType === 1) {
            /*
            // const hex = cardHex && cardHex.startsWith('0x') ? cardHex : (cardHex ? `0x${cardHex}` : null); //
            // if (!hex) {
            //     console.log('No cardHex provided in payload');
            // } else {
            //     const existing = await CardsService.getCardByHex(hex);
            //     if (existing) {
            //         console.log(`Card exists in DB: ${hex} for user ${existing.userId ? existing.userId._id : 'unknown'}`);
            //         if (userId && existing.userId && existing.userId._id.toString() !== userId.toString()) {
            //             console.log(`Warning: card ${hex} appears to belong to different user ${existing.userId._id}`);
            //         }
            //     } else {
            //         if (userId) {
            //             const name = `Card ${hex.slice(-6)}`;
            //             const created = await CardsService.createCard({ name, userId, cardHex: hex, type: 'Card' });
            //             console.log(`Created new card ${created._id} (${hex}) for user ${userId}`);
            //         } else {
            //             console.log(`Card ${hex} not found and no userId provided; skipping create.`);
            //         }
            //     }
            // }
            */

            // const { mac, cardHex, scanType, userId, templateData } = req.body;
            const normalizedCardHex = cardHex
                ? (cardHex.startsWith('0x') ? cardHex : `0x${cardHex}`)
                : null;

            const commandData = {
                mac: mac || null,
                cardHex: normalizedCardHex,
                scanType: Number(scanType) || null,
                userId: userId || null,
                templateData: templateData || null,
            };
            
            try {
                const pendingCommand = await Command.findOne({ status: 'sent' }).sort({ createdAt: 1 });

                console.log('Will pending start?');
                if (pendingCommand?._id) {
                    const action = pendingCommand.action || 201;

                    const mergedData = {
                        ...(pendingCommand.data || {}),
                        ...commandData,
                    };

                    await Command.findByIdAndUpdate(
                        pendingCommand._id,
                        {
                            data: mergedData,
                            status: 'completed',
                        },
                        { new: true }
                    );

                    // const updatedCommand = await Command.updateCommandbyId({id: pendingCommandId, status: 'completed' , data: dataCommand });

                    console.log(`Updated pending command ${pendingCommand._id} (action=${action})`, mergedData);

                    // // Take action based on the command.action to perform follow-up work
                    // if (action === 1) {
                    //     console.log(`Processing createCard command for cardHex ${commandData.cardHex} and userId ${commandData.userId}`);
                    //     // 1 = Add card: create card in DB if userId provided and card doesn't exist
                    //     if (commandData.cardHex && commandData.userId) {
                    //         const existing = await CardsService.getCardByHex(commandData.cardHex);
                    //         if (!existing) {
                    //             const name = `Card ${commandData.cardHex.slice(-6)}`;
                    //             const created = await CardsService.createCard({ name, userId: commandData.userId, cardHex: commandData.cardHex, type: 'Card' });
                    //             console.log(`Created new card ${created._id} (${commandData.cardHex}) for user ${commandData.userId}`);
                    //         } else {
                    //             console.log(`Card ${commandData.cardHex} already exists; skipping create.`);
                    //         }
                    //     }
                        
                    //     // Reset creation session
                    //     global.activeCreatingSession = {
                    //         isCreating: false,
                    //         cardHex: null,
                    //         userId: null,
                    //         status: 'idle'
                    //     };
                    // } else if (action === 9) {
                    //     console.log('We are on 9 (delete)');
                    //     // 9 = Delete card: remove by hex if exists
                    //     if (commandData.cardHex) {
                    //         console.log('We have cardHex');
                    //         const existing = await CardsService.getCardByHex(commandData.cardHex);
                    //         if (existing) {
                    //             await CardsService.deleteCardByHex({ cardHex: commandData.cardHex });
                    //             console.log(`Deleted card ${commandData.cardHex}`);
                    //         } else {
                    //             console.log(`Card ${commandData.cardHex} not found for delete.`);
                    //         }

                    //         // Reset delete session
                    //         global.activeDeleteSession = {
                    //             isDeleting: false,
                    //             cardHex: null,
                    //             cardId: null,
                    //             status: 'idle'
                    //         };
                    //     }
                    // } else {
                    //     // 201 or other actions: we only persist the scanned data on the command
                    //     console.log('No additional action required for action=', action);
                    // }

                } else {
                    // No pending command: create a completed command record so the scan is preserved
                    const actionFallback = 201; // default to ScanCard
                    const createdCommand = await Command.create({
                        action: actionFallback,
                        data: commandData,
                        status: 'completed',
                    });

                    console.log(`Created fallback auth command ${createdCommand._id}`, commandData);
                }

                return res.json({ success: true });
            } catch (err) {
                console.error('Error handling addAuthData:', err);
                return res.status(500).json({ success: false, error: err.message });
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
