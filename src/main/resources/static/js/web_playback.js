var deviceId;
var player;

window.onSpotifyWebPlaybackSDKReady = () => {
    const accessToken = token.access_token;
    player = new Spotify.Player({
        name: 'My Heardle Spotify Player',
        getOAuthToken: cb => { cb(accessToken); },
        volume: 0.3
    });

    player.addListener('ready', ({ device_id }) => {
         deviceId = device_id;

         const connect_to_device = () => {
            fetch("https://api.spotify.com/v1/me/player", {
                method: "PUT",
                body: JSON.stringify({
                    device_ids: [device_id],
                    play: false,
                }),
                headers: new Headers({
                    Authorization: "Bearer " + accessToken,
                }),
            });
         };
         connect_to_device();
    });

    player.connect();
}