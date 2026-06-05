import express from 'express';


import CommandsService from '../services/CommandsService.js';





const router = express.Router();


router.get('/cards' , async (req, res) => {
    try {
        const allcommands = await CommandsService.getAllCommandsForCards();
        const response = {
            status: "success",
            message: "All commands for cards",
            data: allcommands,
        }

        console.log(response);
        res.json(response);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

});


router.get('/fingers' , async (req, res) => {
    try {
        const allcommands = await CommandsService.getAllCommandsForFingers();
        const response = {
            status: "success",
            message: "All commands for fingers",
            data: allcommands,
        }

        console.log(response);
        res.json(response);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

});


export default router;
