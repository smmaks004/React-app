import express from 'express';

import CompaniesService from '../services/CompaniesService.js';
// import { Company } from '../models/company.js';


const router = express.Router();


// Example test route
// router.get('/test', async (req, res) => {
//     const { body } = req;
//     try {
//         // business logic from Services folder.
//         const data = await CompaniesService.getAllCompanies();
//         const response = {
//             status: "success", // success / error
//             message: "Message", // info message about request
//             data, // all data for front-end
//         }
//         res.json(response);
//     } catch (err) {
//         console.log(err);
//         const response = {
//             data: null, // all data for front-end
//             status: "error", // success / error
//             message: err.message // info message about request
//         }
//         res.status(500).json(response);
//     }
// });


// Default - GET all companies
router.get('/', async (req, res) => {
    try {
        const allCompanies = await CompaniesService.getAllCompanies();
        const response = {
            status: "success",
            message: "All companies",
            data: allCompanies
        }

        res.json(response);
    } catch (err) {
        console.log(err);
        const response = {
            status: "error",
            message: err.message,
            data: null
        }
        
        res.status(500).json(response);
    }
});

// Add an endpoint to fetch all companies for the picklist (Names only)
router.get('/companies-names', async (req, res) => {
    try {
        const companies = await CompaniesService.getAllCompaniesName(); // Fetch only the name field
        const response = {
            status: "success",
            message: "Companies names",
            data: companies
        }

        res.json(response);
    } catch (err) {
        console.log(err);
        const response = {
            status: "error",
            message: err.message,
            data: null
        }
        
        res.status(500).json(response);
    }
});





// Create a company
router.post('/create', async (req, res) => {
    const { name, address, industry } = req.body;
    if (!name || !address || !industry) {
        return res.status(400).json({ message: 'Name, address, and industry are required' });
    }
    
    try {
        // const company = new Company({ name, address, industry });
        const company = await CompaniesService.createCompany({ name, address, industry });
        const response = {
            status: "success",
            message: "Company created",
            data: company,
        }
        
        res.json(response);
    } catch (err) {
        console.log(err);
        const response = {
            status: "error",
            message: err.message,
            data: null
        }

        res.status(500).json(response);
    }
});

// Update a company
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, address, industry } = req.body;
    try {
        const updatedCompany = await CompaniesService.updateCompanyById({ id, name, address, industry });
        // if (!updatedCompany) {
        //     return res.status(404).json({ message: 'Company not found' });
        // }

        const response = {
            status: "success",
            message: "Company updated",
            data: updatedCompany,
        }
        
        res.json(response);
    } catch (err) {
        console.log(err);
        const response = {
            status: "error",
            message: err.message,
            data: null
        }
        res.status(500).json(response);
    }
});

// Delete a company
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCompany = await CompaniesService.deleteCompanyById({ id });
        if (!deletedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const response = {
            status: "success",
            message: "Company deleted",
            data: deletedCompany,
        }
        
        res.json(response);
    } catch (err) {
        console.log(err);
        const response = {
            status: "error",
            message: "Tried to delete company: " + err.message,
            data: null
        }
        res.status(500).json(response);
    }
});

export default router;