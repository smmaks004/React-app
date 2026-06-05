import React, { useState } from 'react';



const CreateFinger = () => {

    const [scanStatus, setScanStatus] = useState('');


    // Scanning
    const startScanningProcess = async () => {
        setScanStatus('Requesting controller to wait for a scan...');

        try {
            const resp = await fetch('/api/fingers/trigger-scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });

            const data = await resp.json();

            if (resp.ok && data && data.success !== false) {
                setScanStatus('Controller armed — tap the new card on the device now');
            } else {
                setScanStatus(data.error || 'Failed to request scan');
            }
        } catch (err) {
            console.error(err);
            setScanStatus('Network error while requesting scan');
        }
    };


    return (
        <dev>
            <h3>Create Finger</h3>
            <div className='scanCard'>
                <button onClick={startScanningProcess}>Scan</button>
            </div>
        </dev>
    );

}


export default CreateFinger;
