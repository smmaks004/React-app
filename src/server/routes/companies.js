import express from 'express';

import CompaniesService from '../services/CompaniesService.js';
import { Company } from '../models/company.js';


const router = express.Router();


// Example test route
router.get('/test', async (req, res) => {
    const { body } = req;
    try {
        // business logic from Services folder.
        const data = await CompaniesService.getAllCompanies();
        const response = {
            status: "success", // success / error
            message: "Message", // info message about request
            data, // all data for front-end
        }
        res.json(response);
    } catch (err) {
        console.log(err);
        const response = {
            data: null, // all data for front-end
            status: "error", // success / error
            message: err.message // info message about request
        }
        res.status(500).json(response);
    }
});


// Default - GET all companies
router.get('/', async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add an endpoint to fetch all companies for the picklist
router.get('/companies', async (req, res) => {
    try {
        const companies = await Company.find({}, 'name'); // Fetch only the name field
        res.json(companies);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});





// Create a company
router.post('/create', async (req, res) => {
    const { name, address, industry } = req.body;
    if (!name || !address || !industry) {
        return res.status(400).json({ message: 'Name, address, and industry are required' });
    }
    try {
        const company = new Company({ name, address, industry });
        await company.save();
        res.status(201).json({ message: 'Company created', company });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update a company
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, address, industry } = req.body;
    try {
        const updatedCompany = await Company.findByIdAndUpdate(
            id,
            { name, address, industry },
            { new: true }
        );
        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json({ message: 'Company updated', company: updatedCompany });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Delete a company
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCompany = await Company.findByIdAndDelete(id);
        if (!deletedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json({ message: 'Company deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

export default router;