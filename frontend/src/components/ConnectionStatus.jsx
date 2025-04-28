import React, { useState, useEffect } from 'react';

const ConnectionStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const updateConnectionStatus = () => {
        setIsOnline(navigator.onLine);
    };

    useEffect(() => {
        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);

        return () => {
            window.removeEventListener('online', updateConnectionStatus);
            window.removeEventListener('offline', updateConnectionStatus);
        };
    }, []);

    return (
        <div>
            {!isOnline && (
                <div style={{ color: 'red', textAlign: 'center' }}>
                    <h2>Failed to connect to the server</h2>
                </div>
            )}
        </div>
    );
};

export default ConnectionStatus;
