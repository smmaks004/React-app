import React, { useEffect, useState } from 'react';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';

import CreateZone from './CreateZone';

const Zones = () => {
    const [zones, setZones] = useState([]);
    const [error, setError] = useState(null);

    const fetchZones = async () => {
        try {
            const res = await fetch('/api/zones');
            // if (!res.ok) throw new Error('Failed to fetch zones');
            const { data } = await res.json();
            setZones(data || []);
        } catch (err) {
            console.error('Error fetching zones:', err);
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchZones();
    }, []);

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <CreateZone onZoneCreated={fetchZones} />
            <h2>Zone Page</h2>
            
            <ul>
                {zones.map((z) => (
                    <li key={z._id}>{z.name} - {z.workStart} to {z.workEnd}</li>
                ))}
            </ul>
        </div>
    );
};

export default Zones;