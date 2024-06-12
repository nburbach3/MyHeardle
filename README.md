# MyHeardle

MyHeardle is a web application inspired by Spotify's Heardle game. Listen to segments of a randomly selected song and make guesses as to what the song is. You have 6 attempts to get it right, using up to 16 seconds of the song.
Play now here: https://my-heardle-latest.onrender.com/

## Requirements

This game requires a premium Spotify account to play. This is due to the restrictions put in place by Spotify's API.
The game is currently hosted on Render using their free tier. Because of this, the web application will spin down after some inactivity, resulting in slow start-up times.

## Background

My colleagues and I used to enjoy playing Heardle daily, but Spotify discontinued the game for unknown reasons. This left us disappointed, so I took it upon myself to create my version of the game. Ultimately, I believe it turned out better than the original since we have control over the song selection (eliminating obscure songs from Spotify's version).

## Improvement Ideas

* ✅ **Accessible Gameplay:** ~~Enable gameplay from any location without needing my personal Spotify login or the Spotify app open.~~
  * The game has been refactored to utilize Spotify's Web Playback SDK in order to play music through the browser
* ✅ **Server Integration:** ~~Transition from local storage to a server-based solution. This would provide much greater security, as the application would no longer expose the client's secret.~~
  * A Spring Boot back-end was added to handle authorization calls, making use of Render's environment variables to securely store the client's secret.
* **Custom Genre/Playlist Selection:** Allow users to choose a genre or playlist instead of being restricted to a pre-determined playlist.
* **Leaderboard and Statistics:** Implement a system for maintaining a leaderboard and user statistics.


## Example Gameplay

https://github.com/nburbach3/MyHeardle/assets/42589037/0ae447f9-9277-4de6-ba72-f8316b2a012b

