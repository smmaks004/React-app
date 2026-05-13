import React, { useState, useEffect } from 'react';

const CreateUser = ({ onUserCreated }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companies, setCompanies] = useState([]); // State for companies
  const [selectedCompany, setSelectedCompany] = useState(''); // State for selected company
  const role = 'user';

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch companies from the backend
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('/api/companies/companies');
        if (!res.ok) throw new Error('Failed to fetch companies');
        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        console.error('Error fetching companies:', err);
      }
    };

    fetchCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, email, role, password, company: selectedCompany })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('User created!');

        setName('');
        setSurname('');
        setEmail('');
        setPassword('');
        setSelectedCompany('');

        if (onUserCreated) onUserCreated();
      } else {
        setMessage(data.message || 'Error creating user');
      }
    } catch (err) {
      setMessage('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Surname"
        value={surname}
        onChange={e => setSurname(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <select
        value={selectedCompany}
        onChange={e => setSelectedCompany(e.target.value)}
        required
      >
        <option value="">Select a company</option>
        {companies.map(company => (
          <option key={company._id} value={company._id}>
            {company.name}
          </option>
        ))}
      </select>
      <button type="submit" disabled={loading}>Create</button>
      {message && <span style={{ marginLeft: 8 }}>{message}</span>}
    </form>
  );
};

export default CreateUser;
