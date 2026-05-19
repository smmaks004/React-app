import React from 'react';
import { useNavigate } from 'react-router-dom';



const handleLogout = async () => {

    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });
        const data = await response.json();
        
        navigate('/auth/login', { replace: true });
    } catch (error) {}
};


const Header = ({ onTabChange }) => {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <button 
                onClick={() => onTabChange && onTabChange('userTable')}
                style={{ padding: '8px 16px' }}>
                Users Page
            </button>

            <button 
                onClick={() => onTabChange && onTabChange('companyTable')}
                style={{ padding: '8px 16px' }}>
                Companies Page
            </button>

            <button 
                onClick={() => onTabChange && onTabChange('cardTable')}
                style={{ padding: '8px 16px' }}>
                Cards Page
            </button>

            <button 
                onClick={() => onTabChange && onTabChange('ZoneTable')}
                style={{ padding: '8px 16px' }}>
                Zones Page
            </button>

            <button onClick={handleLogout} style={{ padding: '8px 16px' }}>Log out</button>
        </div>
    );
};

export default Header;
