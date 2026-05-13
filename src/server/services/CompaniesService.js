import { Company } from '../models/company.js';

class CompaniesService {
    
    // Get all companies
    static async getAllCompanies() {
        const companies = await Company.find();
        return companies;
    }

    s


    

}

export default CompaniesService;