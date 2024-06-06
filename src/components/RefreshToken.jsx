import axios from 'axios';
import getToken from './TokenGetter';

const handleLogin = async () => {
    console.log("Refresh")
    const clientID = 'e80d4332836e40af89f2480295383c18';
    const redirectURI = encodeURIComponent('http://localhost:3000/callback');
    const scope = encodeURIComponent('user-read-private user-read-email');
    const responseType = 'token';
    const authURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}&response_type=${responseType}`;
    window.location.href = authURL;
};
const checkAndRefreshToken = async () => {
    const tokenDataString = localStorage.getItem('spotifyAccessToken');
    if (tokenDataString) {
        const tokenData = JSON.parse(tokenDataString);
        const currentTime = new Date();
        console.log(currentTime)
        const expirationTime = new Date(getToken('expiration_time'));
        console.log(expirationTime)
        console.log(tokenData.expiration_time)
        const timeToExpiration = expirationTime - currentTime;
        console.log("Time to expiration:" + timeToExpiration)


        if (timeToExpiration < 60000 * 15) {
            handleLogin();

        }
    }
}

export default checkAndRefreshToken;
