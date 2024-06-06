const getToken = (field) => {
    const tokenDataString = localStorage.getItem('spotifyAccessToken');
    if (tokenDataString) {
        const tokenData = JSON.parse(tokenDataString);
        return tokenData[field];
    }
}

export default getToken;
