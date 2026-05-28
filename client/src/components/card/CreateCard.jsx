import React, { useState } from 'react';




const CreateCard = ({ managingCardsUser, setManagingCardsUser, onCardCreated }) => {

    // New values states
    const [newCardName, setNewCardName] = useState(''); // State for new card input
    const [newCardHex, setNewCardHex] = useState(''); // State for new card hex input
    const [scanStatus, setScanStatus] = useState('');


    // Scanning
    const startScanningProcess = async () => {
        setScanStatus('Requesting controller to wait for a scan...');

        try {
            const resp = await fetch('/api/collector/scan', {
                // method: 'POST',
                // headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify(body),
            });




            const data = await resp.json();




            if (resp.ok && data.success) {
                setScanStatus('Controller armed — tap the new card on the device now');
            } else {
                setScanStatus(data.error || 'Failed to request scan');
            }
        } catch (err) {
            console.error(err);
            setScanStatus('Network error while requesting scan');
        }
    };


    // Handlers
    const handleAddCard = async () => {
        if (!newCardName.trim() || !newCardHex.trim()) return;

        try {
            const response = await fetch('/api/cards/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newCardName,
                    userId: managingCardsUser._id,
                    cardHex: newCardHex
                }),
            });

            if (response.ok) {
                setNewCardName('');
                setNewCardHex('');
                if (onCardCreated) {
                    onCardCreated();
                }
            } else {
                console.error('Failed to add card');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <div>
            <label>Create New Card Manually</label>
            <div className='manualCreation'>
                
                <input
                    type="text"
                    value={newCardName}
                    onChange={(e) => setNewCardName(e.target.value)}
                />
                <label>Card Hex:</label>
                <input
                    type="text"
                    value={newCardHex}
                    onChange={(e) => setNewCardHex(e.target.value)}
                    placeholder="0xA1B2xC3"
                />
                <button onClick={handleAddCard}>Add Card</button>
                <button onClick={() => setManagingCardsUser(null)}>Close</button>
            </div>
            
            
            <label>Create through scanning</label>
            <div className='scanCard'>
                <button onClick={startScanningProcess}>Scan</button>
            </div>

            {scanStatus ? <div className='scanStatus'>{scanStatus}</div> : null}

        </div>


    );


};

export default CreateCard;
