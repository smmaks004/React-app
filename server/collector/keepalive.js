import express from 'express';

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

router.get('/keepalive', (req, res) => {
    const { cmd } = req.query;

    // RULE A: Check if the device is replying back to a finished action
    if (cmd === 'ok') {
        // The device successfully picked up and processed the scan command
        if (activeScanSession.status === 'sent_to_device') {
            activeScanSession.status = 'device_is_scanning'; 
        }
        return res.type('text/plain').send('ack=1'); // Acknowledge and stop sending commands
    }

    // RULE B: If there is a pending command to send
    if (activeScanSession.isScanning && activeScanSession.status === 'pending_device_pickup') {
        
        // Prepare the action 201 command string
        const commandString = JSON.stringify({
            action: 201, // ScanCard
            data: {}
        });

        // Mark it as sent so we don't spam it on the next second's keepalive tick
        activeScanSession.status = 'sent_to_device';

        // Your requirement: Ja ir komandas ko sūtīt, atbildam ar šo:
        console.log(`Sending command to controller: cmd=${commandString}`);
        return res.send(`cmd=${commandString}`);
    }

    if (activeDeleteSession.isDeleting && activeDeleteSession.status === 'pending_device_pickup') {
        const commandString = JSON.stringify({
            action: 9, // deleteCard
            data: { cardHex: activeDeleteSession.cardHex }
        });

        activeDeleteSession.status = 'sent_to_device';

        console.log(`Sending delete command to controller: cmd=${commandString}`);
        return res.send(`cmd=${commandString}`);
    }

        


    // RULE C: Your requirement: Ja nav komandas ko sūtīt, tad atbildam ar - res.send('ack=1');
    res.type('text/plain').send('ack=1');
});




// router.get('/:deviceUid/keepalive', (req, res) => {
//     console.log(' ');
// 	console.log(`--- Keepalive Received from Device: ${req.params.deviceUid} ---`);
// 	console.log('Query parameters:', req.query);    
    
// 	return res.type('text/plain').send(`cmd=ok`);
// });



export default router;
