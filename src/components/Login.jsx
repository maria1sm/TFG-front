import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext';
import Navbar from './Navbar';

const apiCallback = process.env.REACT_APP_CALLBACK;
const envClientId = process.env.REACT_APP_CLIENT_ID;

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
        const clientID = envClientId;
        const redirectURI = encodeURIComponent(apiCallback);
        const scope = encodeURIComponent('user-read-private user-read-email playlist-modify-private');
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


        <div className='d-flex justify-content-center align-items-center h-100 m-2 main-content'>

            <div className="border-transparent shadow-sm rounded bg-gradient bg-secondary p-5 mt-4">
                <div className="d-flex flex-column align-items-center ">
                    <div className="rounded bg-success bg-gradient bg-success d-flex justify-content-center align-items-center p-3 song">
                        <i className="bi bi-music-note-beamed"></i>
                    </div>
                    <h4 className="text-white mt-4">create a new playlist A</h4>
                    <div className="text-light">1 follower <span className='fw-bold'>·</span> made for you</div>
                    <button className='recommendation-btn w-100 mt-3' onClick={handleLogin}>Login with Spotify</button>
                </div>
            </div>
        </div>

    );
};
export default SpotifyLogin;