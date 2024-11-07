import React, { useState } from 'react';
import './App.css';

const PUBLIC_VAPID_KEY = "BHDjmLxkGF1mY8khb3QqJV-0AjITKTF27B5ORHfMcTvWYMSuRMSKkDUo0pK8X0KejNvvrGN5CMSIht_VOtUh7h8";

const { protocol, hostname } = window.location;
const API_PORT = 3001;
const BASE_API_URL = `${protocol}//${hostname}:${API_PORT}`;

function App() {
    const [message, setMessage] = useState('');

    const subscribeUser = async () => {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
            });
            console.log('User is subscribed:', subscription);

            // Send subscription to the server
            await fetch(`${BASE_API_URL}/subscribe`, {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Failed to subscribe the user: ', error);
        }
    };

    const sendNotification = async () => {
        await fetch(`${BASE_API_URL}/send-notification`, {
            method: 'POST',
            body: JSON.stringify({ message }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    return (
        <div className="App">
            <h1>Web Push Notifications</h1>
            <button onClick={subscribeUser}>Subscribe to Notifications</button>
            <textarea
                placeholder="Enter message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendNotification}>Send Notification</button>
        </div>
    );
}

// Utility function to convert VAPID key to Uint8Array
const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

export default App;
