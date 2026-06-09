import express from 'express';
import mongoose from 'mongoose';


import CardsServices from '../services/CardsService.js';
import UsersServices from '../services/UsersService.js';
import CommandsService from '../services/CommandsService.js';

// import { Card } from '../models/card.js';



const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const allCards = await CardsServices.getAllCards();
        const response = {
            status: "success",
            message: "All cards with users info",
            data: allCards,
        }

        console.log(response);
        res.json(response);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

});



// Create a new card for a user
router.post('/create', async (req, res) => {
    const { name, userId , cardHex, type} = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Card name is required' });
    }

    try {
        // const card = new Card({ name, userId });
        // await card.save();
        const card = await CardsServices.createCard({ name, userId, cardHex, type });
        const response = {
            status: "success",
            message: "Card created",
            data: card,
        }

        res.json(response);
        // res.status(201).json({ message: 'Card created successfully', card });
    } catch (err) {
        const response = {
            status: "error",
            message: err.message,
            data: null
        }

        res.status(500).json(response);
    }
});

// Get all cards for a specific user
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // const cards = await Card.find({ userId });
        const cards = await CardsServices.getAllCardsByUserId({ userId });
        const response = {
            status: "success",
            message: "User's cards",
            data: cards,
        }

        res.json(response);
        // res.status(200).json(cards);
    } catch (err) {
        const response = {
            status: "error",
            message: err.message,
            data: null
        }
        
        res.status(500).json(response);
    }
});





router.get('/pending', async (req, res) => {
    try {
        const pendingCards = await CardsServices.getAllPendingCards();
        const response = {
            status: "success",
            message: "All pending cards (not assigned to any user)",
            data: pendingCards,
        }

        console.log(response);
        res.json(response);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Scanning
router.post('/trigger-scan', async (req, res) => { // !!!
    const command = await CommandsService.createCommand({ action: 201, data: null, status: true }); // 201 = ScanCard
    // const card = await CommandsService.createCard({ action: 201, data: null }); 


    res.json({
        message: 'Server is ready. Please swipe the card on the controller now.',
        commandId: command._id,
        // cardId: card._id,
    });

});


// Approval
router.post('/trigger-approval', async (req, res) => {
    const { cardId, userId } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, error: 'User ID is required' });
    }
    if (!cardId) {
        return res.status(400).json({ success: false, error: 'Card ID is required' });
    }

    try {
        const card = await CardsServices.getCardById(cardId); //

        const normalizedCardHex = card.cardHex.startsWith('0x') ? card.cardHex : `0x${card.cardHex}`;
        const name = `Card ${normalizedCardHex.slice(-6)}`;




        const createdCommand = await CommandsService.createCommand({ 
            action: 1, // 1 = addCard
            // data: { name: name, cardHex: normalizedCardHex, userId: userId }, 
            data: { cardHex: normalizedCardHex }, 
            sent: false 
        }); 

        const updatedCard = await CardsServices.updateCardUser({ cardId: cardId, userId: userId });



        // Normalize cardHex to start with 0x

        // Check if card already exists
        // const existingCard = await CardsServices.getCardByHex(normalizedCardHex);
        // if (existingCard) {
        //     return res.status(400).json({ success: false, error: 'Card already exists in database' });
        // }

        // Create the card directly in database
        // const card = await CardsServices.createCard({ 
        //     name, 
        //     userId, 
        //     cardHex: normalizedCardHex, 
        //     type: 'Card' 
        // });

        // console.log(`Created card ${card._id} (${normalizedCardHex}) for user ${userId}`);
        // Also queue a createCard command for the controller so it receives the new card
        // try {
        //     const command = await CommandsService.createCommand({ action: 1, data: { cardHex: normalizedCardHex, userId } }); // 1 = createCard

        //     if (commandId) {
        //         await CommandsService.updateCommandStatus({
        //             id: commandId,
        //             status: 'approved',
        //             data: { ...(await CommandsService.getCommandById({ id: commandId }))?.data, approvedForUserId: userId }
        //         });
        //     }

        //     console.log('Queued createCard command for controller', command._id);
        // } catch (err) {
        //     console.error('Error queuing createCard command:', err);
        // }

        res.json({ success: true, message: 'Card sended for approval successfully', data: updatedCard });
    } catch (err) {
        console.error('Error creating card:', err);
        res.status(500).json({ success: false, error: 'Server error while approving card' });
    }
});


// Deletion
router.delete('/delete/:cardId', async (req, res) => {
    const { cardId } = req.params;
    console.log('(Console) Delete request for cardId:', cardId);

    try {
        const cardToDelete = await CardsServices.getCardById(cardId);
        if (!cardToDelete) {
            return res.status(404).json({ message: 'Card not found' });
        }

        // Create delete command (action 9) to send to device
        const command = await CommandsService.createCommand({ action: 9, data: { cardHex: cardToDelete.cardHex } });

        const deletedCard = await CardsServices.deleteCardById({ cardId });

        res.json({ message: 'Delete command queued', commandId: command._id, data: deletedCard });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



export default router;