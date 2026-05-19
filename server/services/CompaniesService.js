import { Company } from '../models/company.js';

class CompaniesService {
    
    // GET
    static async getAllCompanies() {
        const companies = await Company.find();
        
        return companies;
    }

    static async getAllCompaniesName() {
        const companies = await Company.find({}, 'name'); 
        
        return companies;
    }

    // CREATE
    static async createCompany({ name, address, industry }) {
        const company = new Company({ name, address, industry });
        await company.save();

        return company;
    }

    // UPDATE
    static async updateCompanyById({ id, name, address, industry }) {
        const company = await Company.findByIdAndUpdate(
            id,
            { name, address, industry },
            { new: true }
        );

        return company;
    }

    // DELETE
    static async deleteCompanyById({ id }) {
        const company = await Company.findByIdAndDelete({ _id: id });
        
        return company;
    }

}

export default CompaniesService;