import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onTabChange }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me', {
                    credentials: 'include',
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch current user');
                }
                const responseData = await res.json();
                setUser(responseData.data || null);
            } catch (error) {
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            // Redirect to login even if logout request fails.
        }

        navigate('/auth/login', { replace: true });
    };

    const handleGoToProfile = () => {
        setIsMenuOpen(false);
        navigate('/profile');
    };

    const fullName = user ? `${user.name || ''} ${user.surname || ''}`.trim() : 'Profile';

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

            <div ref={menuRef} style={{ position: 'relative' }}>
                <button
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    style={{ padding: '8px 16px' }}
                >
                    {fullName}
                </button>

                {isMenuOpen && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 4px)',
                            right: 0,
                            background: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: 6,
                            minWidth: 130,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                            zIndex: 10,
                        }}
                    >
                        <button
                            onClick={handleGoToProfile}
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                border: 'none',
                                background: 'transparent',
                                padding: '10px 12px',
                                cursor: 'pointer',
                            }}
                        >
                            Profile
                        </button>

                        <button
                            onClick={handleLogout}
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                border: 'none',
                                background: 'transparent',
                                padding: '10px 12px',
                                cursor: 'pointer',
                            }}
                        >
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
