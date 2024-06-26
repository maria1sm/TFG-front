/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getToken from './TokenGetter';
import checkAndRefreshToken from './RefreshToken';

const SearchBar = ({ query, handleInputChange, handleSearch, handleCancelSearch, toggleSearchType, searchType }) => (
    <div>
        <button onClick={toggleSearchType}>
            {searchType === 'track' ? 'Switch to Artist Search' : 'Switch to Track Search'}
        </button>
        <input type="text" value={query} onChange={handleInputChange} />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleCancelSearch}>Cancel</button>
    </div>
);

const TrackList = ({ tracks, searchType, handleSelect }) => (
    <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
        <h3>Search Results:</h3>
        <ul>
            {tracks.map(item => (
                <li key={item.id}>
                    <span>{item.name}</span>
                    {searchType === 'track' && <span>{item.artists[0].name}</span>}
                    {searchType === 'track'
                        ? item.album.images[2] && <img src={item.album.images[2]?.url} alt={item.name} style={{ width: '60px', height: '60px' }} />
                        : item.images[2] && <img src={item.images[2]?.url} alt={item.name} style={{ width: '60px', height: '60px' }} />
                    }
                    <button onClick={() => handleSelect(item)}>Select</button>
                </li>
            ))}
        </ul>
    </div>
);

const SelectedItems = ({ selectedTracks, selectedArtists, handleRemoveTrack, handleRemoveArtist }) => (
    <div>
        <h3>Selected Tracks:</h3>
        <ul>
            {selectedTracks.map(track => (
                <li key={track.id}>
                    <span>{track.name}</span>
                    <span>{track.artist}</span>
                    <img src={track.picture} alt={track.name} style={{ width: '60px', height: '60px' }} />
                    <button onClick={() => handleRemoveTrack(track.id)}>Remove</button>
                </li>
            ))}
        </ul>
        <h3>Selected Artists:</h3>
        <ul>
            {selectedArtists.map(artist => (
                <li key={artist.id}>
                    <span>{artist.name}</span>
                    <img src={artist.picture} alt={artist.name} style={{ width: '60px', height: '60px' }} />
                    <button onClick={() => handleRemoveArtist(artist.id)}>Remove</button>
                </li>
            ))}
        </ul>
    </div>
);

const RecommendationPlaylist = ({ recommendationPlaylist, playlistName, setPlaylistName, saveError, handleSavePlaylist, handleReset }) => (
    <div>
        <button onClick={handleReset}>Get Another Recommendation</button>
        <h3>Recommended Playlist:</h3>
        <ul>
            {recommendationPlaylist.map((track, index) => (
                <li key={track.id}>
                    <iframe
                        src={`https://open.spotify.com/embed/track/${track.id}`}
                        width="300"
                        height="80"
                        frameBorder="0"
                        allowtransparency="true"
                        allow="encrypted-media"
                        title={`Spotify Embed ${index}`}
                    ></iframe>
                </li>
            ))}
        </ul>
        <input
            type="text"
            placeholder="Enter playlist name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
        />
        {saveError && <p style={{ color: 'red' }}>{saveError}</p>}
        <button onClick={handleSavePlaylist}>Save Playlist</button>
    </div>
);

const ErrorMessage = ({ error }) => error && <p style={{ color: 'red' }}>{error}</p>;

const SearchComponent = () => {
    const [query, setQuery] = useState('');
    const [tracks, setTracks] = useState([]);
    const [selectedTracks, setSelectedTracks] = useState([]);
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [recommendationPlaylist, setRecommendationPlaylist] = useState(null);
    const [playlistSaved, setPlaylistSaved] = useState(false);
    const [error, setError] = useState('');
    const [duplicateError, setDuplicateError] = useState('');
    const [searchClicked, setSearchClicked] = useState(false);
    const [searchType, setSearchType] = useState('track');
    const [playlistName, setPlaylistName] = useState('');
    const [saveError, setSaveError] = useState('');

    useEffect(() => {
        window.onload = checkAndRefreshToken();
        const storedTracks = sessionStorage.getItem('selectedTracks');
        const storedArtists = sessionStorage.getItem('selectedArtists');
        const storedRecommendationPlaylist = sessionStorage.getItem('recommendation_playlist');
        if (storedTracks) setSelectedTracks(JSON.parse(storedTracks));
        if (storedArtists) setSelectedArtists(JSON.parse(storedArtists));
        if (storedRecommendationPlaylist) setRecommendationPlaylist(JSON.parse(storedRecommendationPlaylist));
    }, []);

    const fetchItems = async () => {
        try {
            const token = getToken('access_token');
            if (!token) throw new Error('No access token found');
            if (!query || query.trim() === '*' || query.trim() === "") {
                setError('Query parameter is missing or invalid');
                return;
            }

            const encodedQuery = query.trim();
            const response = await axios.post(
                'http://localhost:8080/api/search',
                { query: encodedQuery, type: searchType },
                { headers: { 'Content-Type': 'application/json', Authorization: `${token}` } }
            );
            searchType === "track" ? setTracks(response.data.tracks.items) : setTracks(response.data.artists.items);
            console.log(response.data);
        } catch (error) {
            console.error('Error searching for items:', error);
            alert('Error searching for items');
        }
    };

    const handleInputChange = (e) => {
        setError('');
        setDuplicateError('');
        setQuery(e.target.value);
    };

    const handleSearch = async () => {
        setSearchClicked(true);
        await checkAndRefreshToken();
        await fetchItems();
    };

    const handleSelectTrack = (track) => {
        if (selectedTracks.length >= 5) {
            setDuplicateError('You can only select up to 5 tracks.');
            return;
        }
        if (selectedTracks.some(selectedTrack => selectedTrack.id === track.id)) {
            setDuplicateError('This track is already selected.');
            return;
        }
        const newTrack = {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            picture: track.album.images[2] ? track.album.images[2].url : track.album.images[0].url
        };
        const updatedTracks = [...selectedTracks, newTrack];
        setSelectedTracks(updatedTracks);
        sessionStorage.setItem('selectedTracks', JSON.stringify(updatedTracks));
        setTracks([]);
        setDuplicateError('');
    };

    const handleSelectArtist = (artist) => {
        if (selectedArtists.length >= 5) {
            setDuplicateError('You can only select up to 5 artists.');
            return;
        }
        if (selectedArtists.some(selectedArtist => selectedArtist.id === artist.id)) {
            setDuplicateError('This artist is already selected.');
            return;
        }
        const newArtist = {
            id: artist.id,
            name: artist.name,
            picture: artist.images[2] ? artist.images[2].url : artist.album.images[0].url
        };
        const updatedArtists = [...selectedArtists, newArtist];
        setSelectedArtists(updatedArtists);
        sessionStorage.setItem('selectedArtists', JSON.stringify(updatedArtists));
        setTracks([]);
        setDuplicateError('');
    };

    const handleCancelSearch = () => setTracks([]);
    const handleRemoveTrack = (trackId) => {
        const updatedSelectedTracks = selectedTracks.filter(track => track.id !== trackId);
        setSelectedTracks(updatedSelectedTracks);
        sessionStorage.setItem('selectedTracks', JSON.stringify(updatedSelectedTracks));
    };
    const handleRemoveArtist = (artistId) => {
        const updatedSelectedArtists = selectedArtists.filter(artist => artist.id !== artistId);
        setSelectedArtists(updatedSelectedArtists);
        sessionStorage.setItem('selectedArtists', JSON.stringify(updatedSelectedArtists));
    };
    const toggleSearchType = () => {
        handleCancelSearch();
        setSearchType(searchType === 'track' ? 'artist' : 'track');
    };

    const handleGetRecommendations = async () => {
        await checkAndRefreshToken();
        const trackIds = selectedTracks.map(track => track.id).join(',');
        const artistIds = selectedArtists.map(artist => artist.id).join(',');

        try {
            const token = getToken('access_token');
            if (!token) throw new Error('No access token found');

            const response = await axios.post(
                'http://localhost:8080/api/recommendations',
                { tracks: trackIds, artists: artistIds },
                { headers: { 'Content-Type': 'application/json', Authorization: `${token}` } }
            );

            sessionStorage.setItem('recommendation_playlist', JSON.stringify(response.data));
            setRecommendationPlaylist(response.data);
            sessionStorage.removeItem('selectedTracks');
            sessionStorage.removeItem('selectedArtists');
            setSelectedTracks([]);
            setSelectedArtists([]);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            alert('Error fetching recommendations');
        }
    };

    const handleReset = () => {
        sessionStorage.removeItem('recommendation_playlist');
        setRecommendationPlaylist(null);
        setPlaylistSaved(false);
        setSearchClicked(false);
    };

    const handleSavePlaylist = async () => {
        if (!playlistName.trim()) {
            setSaveError('Playlist name cannot be empty');
            return;
        }

        try {
            const token = getToken('access_token');
            if (!token) throw new Error('No access token found');

            const trackUris = recommendationPlaylist.map(track => `spotify:track:${track.id}`);
            await axios.post(
                'http://localhost:8080/api/create-playlist',
                { name: playlistName, trackUris: trackUris },
                { headers: { 'Content-Type': 'application/json', Authorization: `${token}` } }
            );
            sessionStorage.removeItem("recommendation_playlist");
            setRecommendationPlaylist(null);
            setPlaylistSaved(true);
        } catch (error) {
            console.error('Error saving playlist:', error);
            alert('Error saving playlist');
        }
    };

    return (
        <div>
            {playlistSaved ? (
                <div>
                    <button onClick={handleReset}>Get Another Recommendation</button>
                    <p>Saved playlist</p>
                </div>
            ) : recommendationPlaylist ? (
                <RecommendationPlaylist
                    recommendationPlaylist={recommendationPlaylist}
                    playlistName={playlistName}
                    setPlaylistName={setPlaylistName}
                    saveError={saveError}
                    handleSavePlaylist={handleSavePlaylist}
                    handleReset={handleReset}
                />
            ) : (
                <div>
                    <SearchBar
                        query={query}
                        handleInputChange={handleInputChange}
                        handleSearch={handleSearch}
                        handleCancelSearch={handleCancelSearch}
                        toggleSearchType={toggleSearchType}
                        searchType={searchType}
                    />
                    <ErrorMessage error={error} />
                    <ErrorMessage error={duplicateError} />
                    <button onClick={handleGetRecommendations}>Get Recommendations</button>
                    {tracks.length > 0 && (
                        <TrackList
                            tracks={tracks}
                            searchType={searchType}
                            handleSelect={searchType === 'track' ? handleSelectTrack : handleSelectArtist}
                        />
                    )}
                    <SelectedItems
                        selectedTracks={selectedTracks}
                        selectedArtists={selectedArtists}
                        handleRemoveTrack={handleRemoveTrack}
                        handleRemoveArtist={handleRemoveArtist}
                    />
                </div>
            )}
        </div>
    );
};

export default SearchComponent;*/


/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getToken from './TokenGetter';
import checkAndRefreshToken from './RefreshToken';

function SearchComponent() {
    const [query, setQuery] = useState('');
    const [tracks, setTracks] = useState([]);
    const [selectedTracks, setSelectedTracks] = useState([]);
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [recommendationPlaylist, setRecommendationPlaylist] = useState(null);
    const [playlistSaved, setPlaylistSaved] = useState(false);
    const [error, setError] = useState('');
    const [duplicateError, setDuplicateError] = useState('');
    const [searchClicked, setSearchClicked] = useState(false);
    const [searchType, setSearchType] = useState('track');
    const [playlistName, setPlaylistName] = useState('');
    const [saveError, setSaveError] = useState('');

    useEffect(() => {
        window.onload = checkAndRefreshToken();
        const storedTracks = sessionStorage.getItem('selectedTracks');
        const storedArtists = sessionStorage.getItem('selectedArtists');
        const storedRecommendationPlaylist = sessionStorage.getItem('recommendation_playlist');
        if (storedTracks) {
            setSelectedTracks(JSON.parse(storedTracks));
        }
        if (storedArtists) {
            setSelectedArtists(JSON.parse(storedArtists));
        }
        if (storedRecommendationPlaylist) {
            setRecommendationPlaylist(JSON.parse(storedRecommendationPlaylist));
        }
    }, []);

    const fetchItems = async () => {
        try {
            const token = getToken('access_token');
            if (!token) {
                throw new Error('No access token found');
            }
            if (!query || query.trim() === '*' || query.trim() === "") {
                setError('Query parameter is missing or invalid');
                return;
            }

            const encodedQuery = query.trim();
            const response = await axios.post(
                'http://localhost:8080/api/search',
                {
                    query: encodedQuery,
                    type: searchType
                },
                {
                    headers:
                    {
                        'Content-Type': 'application/json',
                        Authorization: `${token}`
                    }
                }
            );
            searchType === "track" ? setTracks(response.data.tracks.items) : setTracks(response.data.artists.items);
            console.log(response.data)
        } catch (error) {
            console.error('Error searching for items:', error);
            alert('Error searching for items');
        }
    };

    const handleInputChange = (e) => {
        const input = String(e.target.value);
        setError('');
        setDuplicateError('');
        setQuery(input);
    };

    const handleSearch = async () => {
        setSearchClicked(true);
        await checkAndRefreshToken();
        await fetchItems();
    };

    const handleSelectTrack = (track) => {
        if (selectedTracks.length >= 5) {
            setDuplicateError('You can only select up to 5 tracks.');
            return;
        }
        if (selectedTracks.some(selectedTrack => selectedTrack.id === track.id)) {
            setDuplicateError('This track is already selected.');
            return;
        }
        const newTrack = {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            picture: track.album.images[2] ? track.album.images[2].url : track.album.images[0].url
        };
        const updatedTracks = [...selectedTracks, newTrack];
        setSelectedTracks(updatedTracks);
        sessionStorage.setItem('selectedTracks', JSON.stringify(updatedTracks));
        setTracks([]);
        setDuplicateError('');
    };

    const handleSelectArtist = (artist) => {
        if (selectedArtists.length >= 5) {
            setDuplicateError('You can only select up to 5 artists.');
            return;
        }
        if (selectedArtists.some(selectedArtist => selectedArtist.id === artist.id)) {
            setDuplicateError('This artist is already selected.');
            return;
        }
        const newArtist = {
            id: artist.id,
            name: artist.name,
            picture: artist.images[2] ? artist.images[2].url : artist.album.images[0].url
        };
        const updatedArtists = [...selectedArtists, newArtist];
        setSelectedArtists(updatedArtists);
        sessionStorage.setItem('selectedArtists', JSON.stringify(updatedArtists));
        setTracks([]);
        setDuplicateError('');
    };

    const handleCancelSearch = () => {
        setTracks([]);
    };

    const handleRemoveTrack = (trackId) => {
        const updatedSelectedTracks = selectedTracks.filter(track => track.id !== trackId);
        setSelectedTracks(updatedSelectedTracks);
        sessionStorage.setItem('selectedTracks', JSON.stringify(updatedSelectedTracks));
    };

    const handleRemoveArtist = (artistId) => {
        const updatedSelectedArtists = selectedArtists.filter(artist => artist.id !== artistId);
        setSelectedArtists(updatedSelectedArtists);
        sessionStorage.setItem('selectedArtists', JSON.stringify(updatedSelectedArtists));
    };

    const toggleSearchType = () => {
        handleCancelSearch();
        setSearchType(searchType === 'track' ? 'artist' : 'track');
    };

    const handleGetRecommendations = async () => {
        await checkAndRefreshToken();
        const trackIds = selectedTracks.map(track => track.id).join(',');
        const artistIds = selectedArtists.map(artist => artist.id).join(',');

        try {
            const token = getToken('access_token');
            if (!token) {
                throw new Error('No access token found');
            }

            const response = await axios.post(
                'http://localhost:8080/api/recommendations',
                {
                    tracks: trackIds,
                    artists: artistIds
                },
                {
                    headers:
                    {
                        'Content-Type': 'application/json', Authorization: `${token}`
                    }
                }
            );

            sessionStorage.setItem('recommendation_playlist', JSON.stringify(response.data));
            setRecommendationPlaylist(response.data);
            sessionStorage.removeItem('selectedTracks');
            sessionStorage.removeItem('selectedArtists');
            setSelectedTracks([]);
            setSelectedArtists([]);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            alert('Error fetching recommendations');
        }
    };

    const handleReset = () => {
        sessionStorage.removeItem('recommendation_playlist');
        setRecommendationPlaylist(null);
        setPlaylistSaved(false);
        setSearchClicked(false);
    };

    const handleSavePlaylist = async () => {
        if (!playlistName.trim()) {
            setSaveError('Playlist name cannot be empty');
            return;
        }

        try {
            const token = getToken('access_token');
            if (!token) {
                throw new Error('No access token found');
            }

            const trackUris = recommendationPlaylist.map(track => `spotify:track:${track.id}`);
            await axios.post(
                'http://localhost:8080/api/create-playlist',
                {
                    name: playlistName,
                    trackUris: trackUris
                },
                {
                    headers:
                    {
                        'Content-Type': 'application/json',
                        Authorization: `${token}`
                    }
                }
            );
            sessionStorage.removeItem("recommendation_playlist");
            setRecommendationPlaylist(null);
            setPlaylistSaved(true);
        } catch (error) {
            console.error('Error saving playlist:', error);
            alert('Error saving playlist');
        }
    };

    return (
        <div>
            {playlistSaved ? (
                <div>
                    <button onClick={handleReset}>Get Another Recommendation</button>
                    <p>Saved playlist</p>

                </div>
            ) : recommendationPlaylist ? (
                <div>
                    <button onClick={handleReset}>Get Another Recommendation</button>
                    <h3>Recommended Playlist:</h3>
                    <ul>
                        {recommendationPlaylist.map((track, index) => (
                            <li key={track.id}>
                                <iframe
                                    src={`https://open.spotify.com/embed/track/${track.id}`}
                                    width="300"
                                    height="80"
                                    frameBorder="0"
                                    allowtransparency="true"
                                    allow="encrypted-media"
                                    title={`Spotify Embed ${index}`}
                                ></iframe>
                            </li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        placeholder="Enter playlist name"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                    />
                    {saveError && <p style={{ color: 'red' }}>{saveError}</p>}
                    <button onClick={handleSavePlaylist}>Save Playlist</button>
                </div>
            ) : (
                <div>
                    <button onClick={toggleSearchType}>
                        {searchType === 'track' ? 'Switch to Artist Search' : 'Switch to Track Search'}
                    </button>
                    <input type="text" value={query} onChange={handleInputChange} />
                    {error && searchClicked && <p style={{ color: 'red' }}>{error}</p>}
                    {duplicateError && <p style={{ color: 'red' }}>{duplicateError}</p>}
                    <button onClick={handleSearch}>Search</button>
                    <button onClick={handleCancelSearch}>Cancel</button>
                    <button onClick={handleGetRecommendations}>Get Recommendations</button>

                    {tracks.length > 0 && (
                        <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                            <h3>Search Results:</h3>
                            <ul>
                                {tracks.map(item => (
                                    <li key={item.id}>
                                        <span>{item.name}</span>
                                        {searchType === 'track' && <span>{item.artists[0].name}</span>}
                                        {searchType === 'track'
                                            ? item.album.images[2] && <img src={item.album.images[2]?.url} alt={item.name} style={{ width: '60px', height: '60px' }} />
                                            : item.images[2] && <img src={item.images[2]?.url} alt={item.name} style={{ width: '60px', height: '60px' }} />
                                        }
                                        <button onClick={() => searchType === 'track' ? handleSelectTrack(item) : handleSelectArtist(item)}>Select</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <h3>Selected Tracks:</h3>
                    <ul>
                        {selectedTracks.map(track => (
                            <li key={track.id}>
                                <span>{track.name}</span>
                                <span>{track.artist}</span>
                                <img src={track.picture} alt={track.name} style={{ width: '60px', height: '60px' }} />
                                <button onClick={() => handleRemoveTrack(track.id)}>Remove</button>
                            </li>
                        ))}
                    </ul>

                    <h3>Selected Artists:</h3>
                    <ul>
                        {selectedArtists.map(artist => (
                            <li key={artist.id}>
                                <span>{artist.name}</span>
                                <img src={artist.picture} alt={artist.name} style={{ width: '60px', height: '60px' }} />
                                <button onClick={() => handleRemoveArtist(artist.id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SearchComponent;*/
