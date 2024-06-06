import React, { useState, useEffect } from 'react';
import axios from 'axios';
import checkAndRefreshToken from './RefreshToken';
import getToken from './TokenGetter';

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Retrieve access token from local storage
                const token = getToken('access_token');
                if (!token) {
                    throw new Error('Access token not found in local storage');
                }
                await checkAndRefreshToken();
                const response = await axios.get('http://localhost:8080/api/user-profile', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                setUserProfile(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    if (!userProfile) {
        return <div></div>;
    }

    return (
        <div className="user-profile-container">
            <h1>User Profile</h1>
            <div className="profile-info">
                <h2>{userProfile.display_name}</h2>
                <p>Country: {userProfile.country}</p>
                {userProfile.images && userProfile.images.length > 0 && (
                    <img src={userProfile.images[0].url} alt={`${userProfile.display_name}'s profile`} />
                )}
            </div>
        </div>
    );
};

export default UserProfile;
