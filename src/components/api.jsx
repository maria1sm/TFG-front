import axios from 'axios';
import getToken from './TokenGetter';
import checkAndRefreshToken from './RefreshToken';

const apiUrl = process.env.REACT_APP_CORE;
const apiSearch = process.env.REACT_APP_SEARCH;
const apiRecommendations = process.env.REACT_APP_RECOMMENDATIONS;
const apiCreatePlaylist = process.env.REACT_APP_CREATE_PLAYLIST;

export const fetchItems = async (query, searchType) => {


    try {
        const token = getToken('access_token');
        if (!token) throw new Error('No access token found');
        if (!query || query.trim() === '*' || query.trim() === "") {
            throw new Error('Query parameter is missing or invalid');
        }
        const encodedQuery = query.trim();
        const response = await axios.post(
            apiUrl + apiSearch,
            { query: encodedQuery, type: searchType },
            { headers: { 'Content-Type': 'application/json', Authorization: `${token}` } }
        );
        return searchType === "track" ? response.data.tracks.items : response.data.artists.items;
    } catch (error) {
        console.error('Error searching for items:', error);
        throw error;
    }
};

export const handleSavePlaylist = async (playlistName, recommendationPlaylist) => {
    if (!playlistName.trim()) {
        throw new Error('Playlist name cannot be empty');
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
    } catch (error) {
        console.error('Error saving playlist:', error);
        throw error;
    }
};

export const handleGetRecommendations = async (selectedTracks, selectedArtists) => {
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
        return response.data;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
    }
};
