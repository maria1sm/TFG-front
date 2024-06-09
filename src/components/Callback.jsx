import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../AppContext';
const apiUrl = process.env.REACT_APP_CORE;
const apiLogin = process.env.REACT_APP_LOGIN;
const Callback = () => {
    const { setIsLoggedIn } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const hash = window.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            const accessToken = params.get('access_token');
            const expiration_time = params.get('expires_in');
            const currentTime = new Date();
            const expirationTime = new Date(currentTime.getTime() + expiration_time * 1000);

            if (accessToken) {
                const tokenData = {
                    access_token: accessToken,
                    expiration_time: expirationTime,
                };
                localStorage.setItem('spotifyAccessToken', JSON.stringify(tokenData));
                setIsLoggedIn(true)
                console.log('Access token stored'); // Debug log

                try {
                    // Make a POST request to localhost:8080/api/login
                    const response = await axios.post(apiUrl + apiLogin, {}, {
                        headers: {
                            Authorization: `${accessToken}`
                        }
                    });
                    if (response) {
                        console.log("User registered")
                    }

                } catch (error) {
                    console.error('Error logging in:', error);
                }
                navigate('/home');
            } else {
                console.error('Access token not found');
            }
        };

        fetchData();

    }, [navigate]);

    return <div></div>;
};

export default Callback;
