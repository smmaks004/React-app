import express from 'express';
import CommandsService from '../services/CommandsService.js';

const router = express.Router();

// router.get('/keepalive', (req, res) => {
// 	console.log('--- Keepalive Received ---');
// 	console.log('Query parameters:', req.query);
//     res.send('ack=ok');
// });

// router.get('/batch', (req, res) => {
// 	console.log('--- batch Received ---');
// 	console.log('Query parameters:', req.query);
//     res.send('ack=1');
// });
// router.get('/keepalive', (req, res) => {
//     console.log('--- Keepalive Received ---');
//     const { cmd } = req.query;

//     res.type('text/plain');

//     // 1. If the device is responding to our sync command, let it pass
//     if (cmd === 'ok' || cmd === 'error') {
//         return res.send('cmd=ok'); 
//     }

//     // 2. Force the controller to download the new database template
//     // const jsonCommand = JSON.stringify({ 
//     //     action: 100, 
//     //     data: null 
//     // });

//     // return res.send(`cmd=${jsonCommand}`); 
//         return res.send(`cmd=error`);
// });

// router.get('/keepalive', (req, res) => {
// 	console.log('--- Keepalive Received ---');
// 	console.log('Query parameters:', req.query);
//     // res.send('ack=1');

//     /*
//     // manual work
//     const jsonCommand = JSON.stringify({ 
//         action: 100, // SyncAll - don't work well
//         // action: 201, // ScanCard
//         // action: 9, // deleteCard
//         data: null 
//     });


//     return res.send(`cmd=${jsonCommand}`); 
//     */

//     return res.send(`cmd=ok`);


// });



router.get('/batch', (req, res) => {
	console.log('--- batch Received ---');
	console.log('Query parameters:', req.query);
    res.send('ack=1');
});

router.get('/keepalive', async (req, res) => {
	console.log('--- keepalive Received ---');
    const { cmd } = req.query;

    // console.log("CMD:", cmd);

    try {
        const command = await CommandsService.claimNextPendingCommand();

        if (!command) {
            return res.type('text/plain').send('ack=1');
        }

        const payload = {
            action: command.action,
            data: command.data || {}
        };

        const commandString = JSON.stringify(payload);
        console.log(`Sending command ${command._id} to controller: cmd=${commandString}`);

        return res.type('text/plain').send(`cmd=${commandString}`);
    } catch (err) {
        console.error('keepalive error:', err);
        return res.type('text/plain').send('ack=1');
    }
});




// router.get('/:deviceUid/keepalive', (req, res) => {
//     console.log(' ');
// 	console.log(`--- Keepalive Received from Device: ${req.params.deviceUid} ---`);
// 	console.log('Query parameters:', req.query);    
    
// 	return res.type('text/plain').send(`cmd=ok`);
// });



export default router;
