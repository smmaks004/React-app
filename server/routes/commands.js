import express from 'express';


import CommandsService from '../services/CommandsService.js';





const router = express.Router();


router.get('/' , async (req, res) => {
    try {
        const allcommands = await CommandsService.getAllCommandsForCards();
        const response = {
            status: "success",
            message: "All commands",
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
