import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import checkAndRefreshToken from './RefreshToken';
import getToken from './TokenGetter';
import { AppContext } from '../AppContext';

const apiUrl = process.env.REACT_APP_CORE;
const apiProfile = process.env.REACT_APP_PROFILE;

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);

    const fetchUserProfile = async (retryCount = 4) => {
        if (!isLoggedIn) return;
        try {
            const token = getToken('access_token');
            if (!token) {
                throw new Error('Access token not found in local storage');
            }
            await checkAndRefreshToken();
            const response = await axios.get(apiUrl + apiProfile, {
                headers: {
                    Authorization: `${token}`
                }
            });
            setIsLoggedIn(true);
            setUserProfile(response.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            if (error.response && error.response.status === 500 && retryCount > 0) {
                console.log(`Retrying... ${4 - retryCount + 1}`);
                fetchUserProfile(retryCount - 1);
            }
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [isLoggedIn]);

    const handleLogout = () => {
        setIsLoggedIn(false);
        sessionStorage.removeItem('recommendation_playlist');
        sessionStorage.removeItem('selectedArtists')
        sessionStorage.removeItem('selectedTracks')
        localStorage.removeItem('spotifyAccessToken');

    };

    if (!userProfile) {
        return (
            <div>
                <a className="dropdown-item text-danger" href="#" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-left me-1"></i>
                </a>
            </div>
        ); // Provide feedback to the user
    }

    return (
        <div className="user-profile-container position-relative">
            <div className="profile-info d-flex align-items-center">
                {userProfile.images && userProfile.images.length > 0 && (
                    <div className="dropdown">
                        <img
                            className="rounded-circle dropdown-toggle"
                            src={userProfile.images[0].url}
                            alt={`${userProfile.display_name}'s profile`}
                            id="profileDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{ width: '35px', height: '35px', cursor: 'pointer' }}
                        />
                        <ul className="dropdown-menu dropdown-menu-end text-end mt-2" aria-labelledby="profileDropdown">
                            <li><span className="dropdown-item-text">{userProfile.displayName}</span></li>
                            <li>
                                <a className="dropdown-item text-danger" href="#" onClick={handleLogout}>
                                    <i className="bi bi-box-arrow-left me-1"></i> Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
