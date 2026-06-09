import express from 'express';
import CommandsService from '../services/CommandsService.js';

const router = express.Router();


router.get('/batch', (req, res) => {
	console.log('--- batch Received ---');
	console.log('Query parameters:', req.query);
    res.send('ack=1');
});

router.get('/keepalive', async (req, res) => {
	console.log('--- keepalive Received ---');
    const { cmd } = req.query;

    if(cmd) return res.type('text/plain').send('ack=1'); 

    
    try {
        // const command = await CommandsService.claimNextPendingCommand();
        const command = await CommandsService.getOnePendingCommand(); 

        if (!command) {
            return res.type('text/plain').send('ack=1');
        }

        const payload = {
            action: command.action,
            data: command.data || {}
        };
        
        // !!! 
        // Think about how move deletion logic and etc here, not in cards and commands files
        // if(command.actoin === 1) {}
        // if ....

        const commandString = JSON.stringify(payload);


        command.sent = true;
        await command.save();


        console.log(`Sending command ${command._id} to controller: cmd=${commandString}`);

        return res.type('text/plain').send(`cmd=${commandString}`);
    } catch (err) {
        console.error('keepalive error:', err);
        return res.type('text/plain').send('ack=1');
    }
});



export default router;
