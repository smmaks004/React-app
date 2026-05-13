import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: String,
    address: String,
    industry: String,
});

export const Company = mongoose.models.Company || mongoose.model('Company', companySchema);
