import express from 'express';
import mongoose from 'mongoose';

import CommandsService from '../services/CommandsService.js';
import FingersService from '../services/FingersService.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const allFingers = await FingersService.getAllFingers();
        const response = {
            status: "success",
            message: "All fingers with users info",
            data: allFingers,
        }

        console.log(response);
        res.json(response);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});




router.get('/pending', async (req, res) => {
    try {
        // const pendingCards = await CardsServices.getAllPendingCards();
        const pendingFingers = await FingersService.getAllPendingFingers();
        const response = {
            status: "success",
            message: "All pending fingers (not assigned to any user)",
            data: pendingFingers,
        }

        console.log(response);
        res.json(response);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Scanning
router.post('/trigger-scan', async (req, res) => {
    const command = await CommandsService.createCommand({ action: 200, data: null }); // 200 = ScanFinger

    res.json({
        message: 'Server is ready. Please press finger on the controller now.',
        commandId: command._id,
    });

});

// Approval
router.post('/trigger-approval', async (req, res) => {
    const { fingerId, userId } = req.body;

    if (!fingerId) {
        return res.status(400).json({ success: false, error: 'Finger ID is required' });
    }
    if (!userId) {
        return res.status(400).json({ success: false, error: 'User ID is required' });
    }


    try {
        console.log('Trying to find finger: ', fingerId)
        const finger = await FingersService.getFingerById(fingerId);

        // const name = `Finger ${finger.templateData.slice(-6)}`;

        if (!finger) {
            console.error(`Finger not found for ID: ${fingerId}`);
            return res.status(404).json({ success: false, error: 'Fingerprint record not found' });
        }

        console.log('Trying to create command');
        const createdCommand = await CommandsService.createCommand({ 
            action: 4, // 4 = addFingerprint
            // data: { name: name, cardHex: normalizedCardHex, userId: userId }, 
            data: { fingerId, templateData: finger.templateData }, 
            sent: false 
        }); 


        console.log('Trying to update fingerprint: ', finger);
        const updatedFinger = await FingersService.updateFingerUser({ fingerId: fingerId, userId: userId });


        res.json({ success: true, message: 'Finger sended for approval successfully', data: updatedFinger });
    } catch (err) {
        console.error('Error creating finger:', err);
        res.status(500).json({ success: false, error: 'Server error while approving finger' });
    }
});


// router.post('/trigger-approval', async (req, res) => {
//     const { fingerId, userId } = req.body;

//     if (!userId) {
//         return res.status(400).json({ success: false, error: 'User ID is required' });
//     }

//     try {
//         let fingerTemplateDataFromCommand = null;

//         if (commandId) {
//             const sourceCommand = await CommandsService.getCommandById({ id: commandId });
//             fingerTemplateDataFromCommand = sourceCommand?.data?.templateData || null;

//             if (!sourceCommand) {
//                 return res.status(404).json({ success: false, error: 'Source command not found' });
//             }
//         }

//         const resolvedTemplateData = fingerTemplateDataFromCommand || templateData;
//         if (!resolvedTemplateData) {
//             return res.status(400).json({ success: false, error: 'Template Data or commandId is required' });
//         }

//         // Normalize templateData to start with 0x
//         const existingFinger = await FingersService.getFingerByTemplateData({templateData: templateData});
//         if (existingFinger) {
//             return res.status(400).json({ success: false, error: 'Finger already exists in database' });
//         }

//         // Create the card directly in database
//         const finger = await FingersService.createFinger({ 
//             userId: userId, 
//             templateData: resolvedTemplateData, 
//             type: 'Finger' 
//         });

//         console.log(`Created FINGERPRINT`);
//         // Also queue a addFingerprint command for the controller so it receives the new card
//         try {
//             const command = await CommandsService.createCommand({ action: 4, data: { templateData: templateData, userId } }); // 4 = addFinger

//             if (commandId) {
//                 await CommandsService.updateCommandStatus({
//                     id: commandId,
//                     status: 'approved',
//                     data: { ...(await CommandsService.getCommandById({ id: commandId }))?.data, approvedForUserId: userId }
//                 });
//             }

//             console.log('Queued createCard command for controller', command._id);
//         } catch (err) {
//             console.error('Error queuing createCard command:', err);
//         }
//         res.json({ success: true, message: 'Fingerprint created successfully', data: finger });
//     } catch (err) {
//         console.error('Error creating finger:', err);
//         res.status(500).json({ success: false, error: 'Server error while creating fingerprint' });
//     }
// });


// Deletion
router.delete('/delete/:fingerId', async (req, res) => {
    const { fingerId } = req.params;
    console.log('(Console) Delete request for fingerId:', fingerId);
    try {
        const fingerToDelete = await FingersService.getFingerById(fingerId);

        if (!fingerToDelete) {
            return res.status(404).json({ message: 'Finger not found' });
        }

        const command = await CommandsService.createCommand({ action: 5, data: { fingerId: fingerId } });

        const deletedFinger = await FingersService.deleteFingerById({ fingerId: fingerId });

        res.json({ message: 'Delete command queued', commandId: command._id, data: deletedFinger });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});





export default router;