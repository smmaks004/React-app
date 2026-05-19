import express from 'express';
import ZonesServices from '../services/ZonesService.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const allZones = await ZonesServices.getAllZones();
        const response = {
            status: "success",
            message: "All zones with companies info",
            data: allZones,
        }

        console.log(response);
        res.json(response);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

});

router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const userZones = await ZonesServices.getZonesByUserId({ userId });
        const response = {
            status: 'success',
            message: 'User zones',
            data: userZones,
        };

        res.json(response);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/assign', async (req, res) => {
    const { userId, zoneId } = req.body;

    if (!userId || !zoneId) {
        return res.status(400).json({ message: 'userId and zoneId are required' });
    }

    try {
        const userZone = await ZonesServices.assignZoneToUser({ userId, zoneId });
        const response = {
            status: 'success',
            message: 'Zone assigned to user',
            data: userZone,
        };

        res.json(response);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Create a new zone
router.post('/create', async (req, res) => {
    const { name, workStart, workEnd, companyId, userId } = req.body;

    if (!name || !workStart || !workEnd || !companyId) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const zone = await ZonesServices.createZone({ name, workStart, workEnd, companyId, userId });
        const response = {
            status: "success",
            message: "Zone created",
            data: zone,
        }

        res.json(response);
    } catch (err) {
        const response = {
            status: "error",
            message: "Tried to create zone, but failed: " + err.message,
            data: null
        }

        res.status(500).json(response);
    }
});

export default router;