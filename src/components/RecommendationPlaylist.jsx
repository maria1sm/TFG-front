import React, { useState, useEffect } from 'react';

const RecommendationPlaylist = ({ recommendationPlaylist, playlistName, setPlaylistName, saveError, handleSavePlaylist, handleReset }) => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set a timer to simulate loading for 3 seconds
        const timer = setTimeout(() => {
            setLoading(false);
        }, 4500);

        // Clean up the timer if the component unmounts
        return () => clearTimeout(timer);
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSavePlaylist();
        }
    };

    return (
        <div className='d-flex flex-column align-items-center'>
            <div className='d-flex flex-column align-items-center'>
                <button className='w-100' onClick={handleReset}>Get Another Recommendation</button>
                <input className='flex-grow-1 w-100'
                    type="text"
                    placeholder="Enter playlist name"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            {saveError && <p style={{ color: 'red' }}>{saveError}</p>}
            <button className='recommendation-btn' onClick={handleSavePlaylist}>Save Playlist</button>
            {loading &&
                <div className="spinner-border text-spotify mt-5" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            }
            <ul className='p-0 mt-4 d-flex flex-wrap justify-content-center gap-3 playlist-rec mx-3' style={{ visibility: loading ? 'hidden' : 'visible' }}>
                {recommendationPlaylist.map((track, index) => (
                    <li key={track.id}>
                        <iframe
                            src={`https://open.spotify.com/embed/track/${track.id}`}
                            width="300"
                            height="80"
                            allow="encrypted-media; autoplay; clipboard-write; fullscreen; picture-in-picture"
                            allowtransparency="true"
                            title={`Spotify Embed ${index}`}
                        ></iframe>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default RecommendationPlaylist;
