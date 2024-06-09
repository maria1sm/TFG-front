// components/Home.jsx
import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';
import UserProfile from './Profile';
import Search from './Search';
import SearchComponent from './SearchComponent';
import Navbar from './Navbar';


const Home = () => {
    /*const { setIsLoggedIn } = useContext(AppContext);

    const handleLogout = () => {
        localStorage.removeItem('spotifyAccessToken');
        sessionStorage.removeItem('recommendation_playlist');
        setIsLoggedIn(false);
    };*/
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    return (
        <div className="d-flex flex-column main-content mb-5">
            <SearchComponent />
        </div>
    );
};

export default Home;
