import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        console.log('Access Token:', accessToken);
        const expiration_time = params.get('expires_in');
        console.log("callback " + params);
        const currentTime = new Date();
        const expirationTime = new Date(currentTime.getTime() + expiration_time * 1000);

        if (accessToken) {
            const tokenData = {
                access_token: accessToken,
                expiration_time: expirationTime,
            };
            localStorage.setItem('spotifyAccessToken', JSON.stringify(tokenData));
            console.log('Access token stored'); // Debug log
            navigate('/profile');
        } else {
            console.error('Access token not found');
        }

    }, [navigate]);

    return <div>Processing login...</div>;
};

export default Callback;
