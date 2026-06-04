import express from 'express';

import CardsService from '../services/CardsService.js';
import CommandsService from '../services/CommandsService.js';
// import { Command } from '../models/command.js';

const router = express.Router();


router.get('/online', async (req, res) => {
    console.log('--- /online received ---');
    console.log(req.url);
    const { mac, src, scanType, trsn } = req.query;

    console.log("Transaction data", trsn);
    
    return res.type('text/plain').send('ack=1'); 


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
                // const pendingCommand = await Command.findOne({ status: 'sent' }).sort({ createdAt: 1 });
                const pendingCommand = CommandsService.getCommandByStatus({ status: 'sent' });

                console.log('Will pending start?');
                if (pendingCommand?._id) {
                    const action = pendingCommand.action || 201;

                    const mergedData = {
                        ...(pendingCommand.data || {}),
                        ...commandData,
                    };

                    // await Command.findByIdAndUpdate(
                    //     pendingCommand._id,
                    //     {
                    //         data: mergedData,
                    //         status: 'completed',
                    //     },
                    //     { new: true }
                    // );

                    const updatedCommand= await CommandsService.updateCommandToCompletedById(
                        {
                            commandId: pendingCommand._id,
                            data: mergedData
                        }
                    );



                    // const updatedCommand = await Command.updateCommandbyId({id: pendingCommandId, status: 'completed' , data: dataCommand });

                    console.log(`Updated pending command ${pendingCommand._id} (action=${action})`, mergedData);
                } else {
                    // No pending command: create a completed command record so the scan is preserved
                    // const actionFallback = 201; // default to ScanCard
                    // const createdCommand = await Command.create({
                    //     action: actionFallback,
                    //     data: commandData,
                    //     status: 'completed',
                    // });

                    const createdCommand = await CommandsService.createCompletedCommand(
                        { 
                            action: 201,  // default to ScanCard
                            data: commandData 
                        }
                    );

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
