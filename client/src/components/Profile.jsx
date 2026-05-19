import React, { useEffect, useState } from 'react';

const ensureDataUrl = (value) => {
    if (!value) {
        return '';
    }

    if (value.startsWith('data:image')) {
        return value;
    }

    return `data:image/png;base64,${value}`;
};

const Profile = () => {
    const [user, setUser] = useState(null);
    const [picture, setPicture] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const [userRes, pictureRes] = await Promise.all([
                    fetch('/api/auth/me', { credentials: 'include' }),
                    fetch('/api/pictures/user-picture', { credentials: 'include' }),
                ]);

                if (!userRes.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const userData = await userRes.json();
                setUser(userData.data || null);

                if (pictureRes.ok) {
                    const pictureData = await pictureRes.json();
                    setPicture(pictureData.data?.base64 || '');
                }
            } catch (err) {
                setError(err.message || 'Failed to load profile');
            }
        };

        loadProfile();
    }, []);

    const handleUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = async () => {
            const result = typeof reader.result === 'string' ? reader.result : '';
            if (!result) {
                setError('Failed to read image file');
                return;
            }

            try {
                const res = await fetch('/api/pictures/change-user-picture', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ base64: result, goal: 'profile' }),
                });

                if (!res.ok) {
                    throw new Error('Failed to upload picture');
                }

                const responseData = await res.json();
                setPicture(responseData.data?.base64 || result);
                setMessage('Picture uploaded');
                setError('');
            } catch (err) {
                setError(err.message || 'Failed to upload picture');
                setMessage('');
            }
        };

        reader.readAsDataURL(file);
    };

    const handleBack = () => {
        window.history.back();
    }

    return (
        
        <div style={{ maxWidth: 500, margin: '20px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <button onClick={handleBack}>Back</button>
            </div>

            <h2>Profile</h2>

            <div style={{ marginBottom: 16 }}>
                {picture ? (
                    <img
                        src={ensureDataUrl(picture)}
                        alt="Profile"
                        style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }}
                    />
                ) : (
                    <div
                        style={{
                            width: 180,
                            height: 180,
                            border: '1px solid #ccc',
                            borderRadius: 8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#666',
                        }}
                    >
                        No picture
                    </div>
                )}
            </div>

            <div style={{ marginBottom: 20 }}>
                <input type="file" accept="image/*" onChange={handleUpload} />
            </div>

            <div style={{ marginBottom: 8 }}><strong>Name:</strong> {user?.name || '-'}</div>
            <div style={{ marginBottom: 8 }}><strong>Surname:</strong> {user?.surname || '-'}</div>
            <div style={{ marginBottom: 8 }}><strong>Email:</strong> {user?.email || '-'}</div>

            {message && <div style={{ color: 'green', marginTop: 12 }}>{message}</div>}
            {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
        </div>
    );
};

export default Profile;
