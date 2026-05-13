import React, { useEffect, useState } from 'react';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import CreateCompany from './CreateCompany';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [error, setError] = useState(null);
    const [editingCompany, setEditingCompany] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchCompanies = async () => {
        try {
            const response = await fetch('/api/companies');
            if (response.ok) {
                const data = await response.json();
                setCompanies(data);
            } else {
                setError('Failed to fetch companies');
            }
        } catch (err) {
            setError('Error fetching companies');
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/companies/delete/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchCompanies();
            } else {
                console.error('Failed to delete company');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleEdit = (company) => {
        setEditingCompany(company);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingCompany(null);
    };

    const handleModalSave = async (updatedCompany) => {
        try {
            const response = await fetch(`/api/companies/update/${updatedCompany._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCompany),
            });
            if (response.ok) {
                fetchCompanies();
                handleModalClose();
            } else {
                console.error('Failed to update company');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    return (
        <div>
            <h2>Companies</h2>
            <CreateCompany onCompanyCreated={fetchCompanies} />
            <ul>
                {companies.map((company) => (
                    <li key={company._id}>
                        <strong>Name:</strong> {company.name}, <strong>Address:</strong> {company.address}, <strong>Industry:</strong> {company.industry}
                        <button onClick={() => handleEdit(company)}>Edit</button>
                        <button onClick={() => handleDelete(company._id)}>Delete</button>
                    </li>
                ))}
            </ul>
            {showModal && (
                <div className="modal">
                    <h3>Edit Company</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleModalSave(editingCompany);
                        }}
                    >
                        <div>
                            <label>Name:</label>
                            <input
                                type="text"
                                value={editingCompany.name}
                                onChange={(e) =>
                                    setEditingCompany({ ...editingCompany, name: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label>Address:</label>
                            <input
                                type="text"
                                value={editingCompany.address}
                                onChange={(e) =>
                                    setEditingCompany({ ...editingCompany, address: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label>Industry:</label>
                            <input
                                type="text"
                                value={editingCompany.industry}
                                onChange={(e) =>
                                    setEditingCompany({ ...editingCompany, industry: e.target.value })
                                }
                            />
                        </div>
                        <button type="submit">Save</button>
                        <button type="button" onClick={handleModalClose}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Companies;