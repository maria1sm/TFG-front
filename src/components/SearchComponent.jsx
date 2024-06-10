import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getToken from './TokenGetter';
import checkAndRefreshToken from './RefreshToken';

import SearchBar from './SearchBar';
import TrackList from './TrackList';
import SelectedItems from './SelectedItems';
import RecommendationPlaylist from './RecommendationPlaylist';
import ErrorMessage from './ErrorMessage';

const apiUrl = process.env.REACT_APP_CORE;
const apiRecommendations = process.env.REACT_APP_RECOMMENDATIONS;
const apiSearch = process.env.REACT_APP_SEARCH;
const apiCreatePlaylist = process.env.REACT_APP_CREATE_PLAYLIST;

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
            if (!query || query.trim() === "") {
                return;
            }
            if (query.trim() === '*') {
                setError('Query parameter is missing or invalid');
                return;
            }
            const encodedQuery = query.trim();
            const response = await axios.post(
                apiUrl + apiSearch,
                { query: encodedQuery, type: searchType },
                { headers: { 'Content-Type': 'application/json', Authorization: `${token}` } }
            );
            setTracks(searchType === "track" ? response.data.tracks.items : response.data.artists.items);
        } catch (error) {
            console.error('Error searching for items:', error);
            alert('Error searching for items');
        }
    };

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        setError('');
        setDuplicateError('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearch = async () => {
        setSearchClicked(true);
        await checkAndRefreshToken();
        await fetchItems();
    };

    const handleSelectTrack = (track) => {
        if (selectedArtists.length + selectedTracks.length >= 5) {
            setDuplicateError('You can only select up to 5 items.');
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
        if (selectedArtists.length + selectedTracks.length >= 5) {
            setDuplicateError('You can only select up to 5 items.');
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
        setQuery('');
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
        if (!sessionStorage.getItem('selectedTracks') && !sessionStorage.getItem('selectedArtists')) {
            return
        }
        await checkAndRefreshToken();
        const trackIds = selectedTracks.map(track => track.id).join(',');
        const artistIds = selectedArtists.map(artist => artist.id).join(',');

        try {
            const token = getToken('access_token');
            if (!token) throw new Error('No access token found');

            const response = await axios.post(
                apiUrl + apiRecommendations,
                { tracks: trackIds, artists: artistIds },
                { headers: { 'Content-Type': 'application/json', Authorization: `${token}` } }
            );

            sessionStorage.setItem('recommendation_playlist', JSON.stringify(response.data));
            setRecommendationPlaylist(response.data);
            sessionStorage.removeItem('selectedTracks');
            sessionStorage.removeItem('selectedArtists');
            setSelectedTracks([]);
            setSelectedArtists([]);
            setDuplicateError('');
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            alert('Error fetching recommendations');
        }
    };

    const handleReset = () => {
        sessionStorage.removeItem('recommendation_playlist');
        setSaveError('')
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
                apiUrl + apiCreatePlaylist,
                { name: playlistName, trackUris: trackUris },
                { headers: { 'Content-Type': 'application/json', Authorization: `${token}` } }
            );
            sessionStorage.removeItem("recommendation_playlist");
            setRecommendationPlaylist(null);
            setSaveError('')
            setPlaylistSaved(true);
        } catch (error) {
            console.error('Error saving playlist:', error);
            alert('Error saving playlist');
        }
    };

    return (
        <div className='d-flex flex-column align-items-center'>
            {playlistSaved ? (
                <div>
                    <button onClick={handleReset}>Get Another Recommendation</button>
                    <div className='d-flex justify-content-center mt-3 align-items-center gap-2'>
                        <p className='text-center mt-2'>Playlist Saved</p>
                        <i className="bi bi-bookmark-check-fill h4"></i>
                    </div>

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
                <div className='d-flex flex-column justify-content-center container-lg track-content'>
                    <div className='position-sticky search-bar t-n2'>
                        <SearchBar
                            query={query}
                            handleInputChange={handleInputChange}
                            handleKeyDown={handleKeyDown}
                            handleSearch={handleSearch}
                            handleCancelSearch={handleCancelSearch}
                            toggleSearchType={toggleSearchType}
                            searchType={searchType}
                        />
                        <ErrorMessage error={error} />
                        <ErrorMessage error={duplicateError} />
                    </div>
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

                    <button className='mb-4 recommendation-btn mt-4 d-flex justify-content-center' onClick={handleGetRecommendations}>Get Recommendations</button>

                </div>
            )}
        </div>
    );
};

export default SearchComponent;
