import React, { useState, useEffect } from 'react';

const CreateZone = ({ onZoneCreated }) => {
    const [name, setName] = useState('');
    const [workStart, setWorkStart] = useState('');
    const [workEnd, setWorkEnd] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await fetch('/api/companies/companies-names');
            if (!res.ok) return;
            const json = await res.json();
            setCompanies(json.data || []);
        } catch (err) {
            console.error('Failed to fetch companies', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/zones/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, workStart, workEnd, companyId }),
            });
            if (response.ok) {
                const { data } = await response.json();
                onZoneCreated && onZoneCreated();
                setName('');
                setWorkStart('');
                setWorkEnd('');
                setCompanyId('');
            } else {
                console.error('Failed to create zone');
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
                <label>Work start:</label>
                <input pattern='HH:MM'
                    type="time"
                    value={workStart}
                    onChange={(e) => setWorkStart(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Work end:</label>
                <input
                    type="time"
                    value={workEnd}
                    onChange={(e) => setWorkEnd(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Company:</label>
                <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} required>
                    <option value="">-- Select company --</option>
                    {companies.map((company) => (
                        <option key={company._id} value={company._id}>{company.name}</option>
                    ))}
                </select>
            </div>

            <button type="submit">Create Zone</button>
        </form>
    );
};

export default CreateZone;