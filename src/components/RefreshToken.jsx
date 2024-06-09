import getToken from './TokenGetter';
const envClientId = process.env.REACT_APP_CLIENT_ID;
const callback = process.env.REACT_APP_CALLBACK;

const handleLogin = async () => {
    console.log("Refresh")
    const clientID = envClientId;
    const redirectURI = encodeURIComponent(callback);
    const scope = encodeURIComponent('user-read-private user-read-email playlist-modify-private');
    const responseType = 'token';
    const authURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}&response_type=${responseType}`;
    window.location.href = authURL;
};
const checkAndRefreshToken = async () => {
    const tokenDataString = localStorage.getItem('spotifyAccessToken');
    if (tokenDataString) {
        const tokenData = JSON.parse(tokenDataString);
        const currentTime = new Date();
        const expirationTime = new Date(getToken('expiration_time'));
        const timeToExpiration = expirationTime - currentTime;
        if (timeToExpiration < 60000 * 15) {
            handleLogin();

        }
    }
}

export default checkAndRefreshToken;
