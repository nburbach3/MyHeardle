# MyHeardle

MyHeardle is a web application inspired by Spotify's Heardle game. Listen to segments of a randomly selected song and make guesses as to what the song is. You have 6 attempts to get it right, using up to 16 seconds of the song.

## Requirements/Limitations
**IN DEVELOPMENT MODE**

This application is currently only available to specific users due to being in Spotify's development mode. Once approved to be in "extended quota" mode, the application will be available to anyone who has a premium Spotify account.
The limitation to only allow premium users is a restriction put in place by Spotify's API.

## Background

My colleagues and I used to enjoy playing Heardle daily, but Spotify discontinued the game for unknown reasons. This left us disappointed, so I took it upon myself to create my version of the game. Ultimately, I believe it turned out better than the original since we have control over the song selection (eliminating obscure songs from Spotify's version).

## Improvement Ideas

* ✅ **Accessible Gameplay:** ~~Enable gameplay from any location without needing my personal Spotify login or the Spotify app open.~~
  * The game has been refactored to utilize Spotify's Web Playback SDK in order to play music through the browser
* ✅ **Server Integration:** ~~Transition from local storage to a server-based solution. This would provide much greater security, as the application would no longer expose the client's secret.~~
  * A Spring Boot back-end was added to handle authorization calls, making use of Render's environment variables to securely store the client's secret.
* **Custom Genre/Playlist Selection:** Allow users to choose a genre or playlist instead of being restricted to a pre-determined playlist.
* **Leaderboard and Statistics:** Implement a system for maintaining a leaderboard and user statistics.
  * Users may see their statistics by clicking the stats icon. This data utilizes local storage, so a user may view their statistics even after navigating away from the page.


## Example Gameplay

https://github.com/nburbach3/MyHeardle/assets/42589037/0ae447f9-9277-4de6-ba72-f8316b2a012b

