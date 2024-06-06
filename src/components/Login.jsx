import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext';

import axios from 'axios';
import qs from 'qs';

const SpotifyLogin = () => {
    const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('spotifyAccessToken');
        if (token) {
            setIsLoggedIn(true);
        }
    }, [setIsLoggedIn]);

    const handleLogin = async () => {
        const clientID = 'e80d4332836e40af89f2480295383c18';
        const redirectURI = encodeURIComponent('http://localhost:3000/callback');
        const scope = encodeURIComponent('user-read-private user-read-email');
        const responseType = 'token';
        const authURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}&response_type=${responseType}`;
        window.location.href = authURL;
    };

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/home');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleLogin}>Login with Spotify</button>
        </div>
    );
};
const handleLogin = async () => {
    const clientID = 'e80d4332836e40af89f2480295383c18';
    const redirectURI = encodeURIComponent('http://localhost:3000/callback');
    const scope = encodeURIComponent('user-read-private user-read-email');
    const responseType = 'token';
    const authURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}&response_type=${responseType}`;
    window.location.href = authURL;
};
export default SpotifyLogin;


/*import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext';

const SpotifyLogin = () => {
    const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('spotifyAccessToken');
        if (token) {
            setIsLoggedIn(true);
        }
    }, [setIsLoggedIn]);

    const handleLogin = () => {
        const clientID = 'e80d4332836e40af89f2480295383c18';
        const redirectURI = encodeURIComponent('http://localhost:3000/callback');
        const scope = encodeURIComponent('user-read-private user-read-email');
        const responseType = 'token';
        const authURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}&response_type=${responseType}`;
        window.location.href = authURL;
    };

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/home');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleLogin}>Login with Spotify</button>
        </div>
    );
};

export default SpotifyLogin;
*/