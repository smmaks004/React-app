import express from 'express';

const router = express.Router();

router.get('/keepalive', (req, res) => {
	console.log('--- Keepalive Received ---');
	console.log('Query parameters:', req.query);
    res.send('ack=1');
});

router.get('/batch', (req, res) => {
	console.log('--- batch Received ---');
	console.log('Query parameters:', req.query);
    res.send('ack=1');
});
// router.get('/keepalive', (req, res) => {
//     console.log('--- Keepalive Received ---');
//     const { cmd } = req.query;

//     res.type('text/plain');

//     // 1. If the device is responding to our sync command, let it pass
//     if (cmd === 'ok' || cmd === 'error') {
//         return res.send('cmd=ok'); 
//     }

//     // 2. Force the controller to download the new database template
//     const jsonCommand = JSON.stringify({ 
//         action: 100, 
//         data: null 
//     });

//     return res.send(`cmd=${jsonCommand}`); 
// });









// To know my HEX
/*
router.get('/keepalive', (req, res) => {
	console.log('--- Keepalive Received ---');
    console.log('Query parameters:', req.query);

    const { cmd } = req.query;

    res.type('text/plain');

    if (cmd === 'ok' || cmd === 'error') {
        return res.send('cmd=ok'); 
    }

    // const jsonCommand = JSON.stringify({ 
    //     action: 100, 
    //     data: null 
    // });
    const jsonCommand = JSON.stringify({ 
        action: 201 , 
        data: { userId: 76} 
    });

    return res.send(`cmd=${jsonCommand}`);
});
*/



router.get('/:deviceUid/keepalive', (req, res) => {
    console.log(' ');
	console.log(`--- Keepalive Received from Device: ${req.params.deviceUid} ---`);
	console.log('Query parameters:', req.query);    
    
	return res.type('text/plain').send(`cmd=ok`);
});



export default router;
