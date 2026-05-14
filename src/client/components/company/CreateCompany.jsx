import React, { useState } from 'react';

const CreateCompany = ({ onCompanyCreated }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [industry, setIndustry] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/companies/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, address, industry }),
            });
            if (response.ok) {
                const { data } = await response.json();
                onCompanyCreated(); // Notify parent to refresh the list
                setName('');
                setAddress('');
                setIndustry('');
            } else {
                console.error('Failed to create company');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Address:</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Industry:</label>
                <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Create Company</button>
        </form>
    );
};

export default CreateCompany;