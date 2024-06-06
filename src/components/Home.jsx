// components/Home.jsx
import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import UserProfile from './Profile';
import Search from './Search';

const Home = () => {
    const { setIsLoggedIn } = useContext(AppContext);

    const handleLogout = () => {
        localStorage.removeItem('spotifyAccessToken');
        setIsLoggedIn(false);
    };

    return (
        <div>
            <h1>Home</h1>
            <button onClick={handleLogout}>Logout</button>
            {<UserProfile></UserProfile>}
            {<Search></Search>}
        </div>
    );
};

export default Home;



// Home.js
/*import React from 'react';

const Home = () => {
    const handleLogout = () => {
        localStorage.removeItem('spotifyAccessToken');
        //window.location.href = '/';
    };

    return (
        <div>
            <h1>Home</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Home;*/
