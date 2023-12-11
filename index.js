function setAuthorization(callback) {
    let loadedAuthorization = localStorage.getItem("loadedAuthorization");

    if (!loadedAuthorization) {
        requestAuthorization();
    }

    if (window.location.search.length > 0) {
        handleRedirect(callback);
    } else {
        callback();
    }
}

function setupGame() {
    // Set the global access token so we don't have to keep retrieving it
    access_token = localStorage.getItem("access_token");

    let storageRandomSong = localStorage.getItem("randomSong");
    let storageSongArray = localStorage.getItem("songArray");
    if (!storageRandomSong && !storageSongArray) {
        getSongs();
    } else {
        randomSong = JSON.parse(storageRandomSong);
        songArray = JSON.parse(storageSongArray);
        setSongDropdown();
        setInitialResults(randomSong);
        enableButtons();
    }

    getDevices();
}


function setFields() {
    for (let i = 1; i <= 6; i++) {
        let guessBox = localStorage.getItem("guessBox" + i);
        if (guessBox && i != 6) {
            let index = i + 1;
            $("#play" + index).css("background-color", "rgb(65, 65, 65)");
        }
        switch (guessBox) {
            case ("skip"):
                $("#guessBox" + i).children(".skipped").attr('hidden', false);
                $("#guessBox" + i).children(".skippedText").attr('hidden', false);
                break;
            case ("wrong"):
                $("#guessBox" + i).children(".wrong").attr('hidden', false);
                $("#guessBox" + i).children(".guessedSongText").attr('hidden', false);
                $("#guessBox" + i).children(".guessedSongText").text(localStorage.getItem("guessBox" + i + "Text"));
                break;
            case ("partial"):
                $("#guessBox" + i).children(".partiallyCorrect").attr('hidden', false);
                $("#guessBox" + i).children(".guessedSongText").attr('hidden', false);
                $("#guessBox" + i).children(".guessedSongText").text(localStorage.getItem("guessBox" + i + "Text"));
                break;
            case ("correct"):
                $("#guessBox" + i).children(".correct").attr('hidden', false);
                $("#guessBox" + i).children(".guessedSongText").attr('hidden', false);
                $("#guessBox" + i).children(".guessedSongText").text(localStorage.getItem("guessBox" + i + "Text"));
                break;
            default:
        }
    }

    let storageSkipText = localStorage.getItem("skipText");
    $("#skipButton").text(storageSkipText != "undefined" && storageSkipText != null ? storageSkipText : "SKIP (+1s)");
}

function requestAuthorization() {
    localStorage.setItem("client_id", SPOTIFY_CLIENT_ID);
    localStorage.setItem("client_secret", SPOTIFY_CLIENT_SECRET);
    localStorage.setItem("loadedAuthorization", "true");

    let authorizeURL = "https://accounts.spotify.com/authorize";
    let URL = authorizeURL + "?client_id=" + SPOTIFY_CLIENT_ID + "&response_type=code" + "&redirect_uri=" + encodeURI(redirect_uri) + "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private"
    window.location.href = URL;
}

function handleRedirect(callback) {
    let code = getCode();
    fetchAccessToken(code, callback);
    window.history.pushState("", "", redirect_uri);
}

function getCode() {
    let code;
    const queryString = window.location.search;
    if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
    }
    return code;
}

function fetchAccessToken(code, callback) {
    let body = "grant_type=authorization_code" + "&code=" + code + "&redirect_uri=" + encodeURI(redirect_uri) + "&client_id=" + SPOTIFY_CLIENT_ID + "&client_secret=" + SPOTIFY_CLIENT_SECRET;
    callAuthorization(body, callback);
}

function callAuthorization(body, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Authorization", "Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET));
    xhr.send(body);
    xhr.extraInfo = callback;
    xhr.onload = (e) => {
        if (e.target.status == 200) {
            let data = JSON.parse(e.target.responseText);
            if (data.access_token) {
                localStorage.setItem("access_token", data.access_token);
            }
            e.target.extraInfo && callback();
            window.location.reload;
        }
    }
}

function callAPI(method, url, body, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + access_token);
    xhr.send(body);
    xhr.onload = callback;
}

function handleGetSongsResponse() {
    if (this.status == 200) {
        let data = JSON.parse(this.responseText);
        if (songArray) {
            songArray = songArray.concat(data.tracks.items);
        } else {
            songArray = data.tracks.items;
        }
        if (songArray.length == 500) {
            songArray = data.tracks.items;
            songArray = removeDuplicateSongs(songArray);
            shuffle(songArray);
            setSongDropdown();
            randomSong = pickRandomSong(songArray);
            setInitialResults(randomSong);
            localStorage.setItem("randomSong", JSON.stringify(randomSong));
            localStorage.setItem("songArray", JSON.stringify(songArray));
            enableButtons();
        }
    } else if (this.status = 401) {
        requestAuthorization();
    }
}

function getSongs() {
    for (let i = 0; i < 5; i++) {
        let url = GET_SONGS + "?offset=" + i * 100 + "&limit=100";
        callAPI("GET", url, null, handleGetSongsResponse);
    }
}

function removeDuplicateSongs(songArray) {
    let dict = {};
    songArray.forEach(function (song) {
        if (dict[song.track.name]) {
            //If we have already seen the song name once, remove the song
            songArray = songArray.filter(function (duplicateSong) {
                return duplicateSong.track.id != song.track.id
            });
        } else {
            //If it is the first time seeing the song, set an indicator value
            dict[song.track.name] = 1;
        }
    });
    return songArray;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function setInitialResults(randomSong) {

    $("#resultImage").attr('src', randomSong.track.album.images[0].url);

    let songName = randomSong.track.name + " (";

    for (let i = 0; i < randomSong.track.artists.length; i++) {
        if (i == randomSong.track.artists.length - 1) {
            songName += randomSong.track.artists[i].name + ")";
        } else {
            songName += randomSong.track.artists[i].name + ", ";
        }
    }
    $("#resultSong").text(songName);
    $("#spotifyLink").attr('href', randomSong.track.external_urls.spotify);
}

function pickRandomSong(songArray) {
    let randomIndex = Math.floor(Math.random() * songArray.length);
    return songArray[randomIndex];
}

// Keeping this here for potential future development
function handlePlaySongResponse() { }

function playSong() {
    let attempts = localStorage.getItem("attemptNumber");
    if (attempts == "6") {
        alert("You already finished playing.");
        return;
    }

    localStorage.setItem("currentlyPlaying", "true");

    paused = "false";
    $("#playButton").hide();
    $("#pauseButton").show();

    let position_ms = 0;
    if (timeLeftGlobal) {
        switch (attempts) {
            case (null):
                position_ms = 1000 - timeLeftGlobal;
                break;
            case ("1"):
                position_ms = 2000 - timeLeftGlobal;
                break;
            case ("2"):
                position_ms = 4000 - timeLeftGlobal;
                break;
            case ("3"):
                position_ms = 8000 - timeLeftGlobal;
                break;
            case ("4"):
                position_ms = 12000 - timeLeftGlobal;
                break;
            case ("5"):
                position_ms = 16000 - timeLeftGlobal;
                break;
            default:
        }
    }

    let context_uri = "spotify:playlist:5XALIurWS8TuF6kk8bj438";
    let offset = {
        "uri": "spotify:track:" + randomSong.track.id
    }
    let body = {
        "context_uri": context_uri,
        "offset": offset,
        "position_ms": position_ms
    };
    let url;
    if (deviceId) {
        url = PLAY_SONG + "?device_id=" + deviceId;
    }
    callAPI("PUT", url, JSON.stringify(body), handlePlaySongResponse);
    handleTime();
}

function handleTime() {
    let attempts = localStorage.getItem("attemptNumber");
    let countDownTime = new Date().getTime();

    if (timeLeftGlobal) {
        countDownTime += timeLeftGlobal;
    } else {
        switch (attempts) {
            case (null):
                countDownTime += 1000;
                break;
            case ("1"):
                countDownTime += 2000;
                break;
            case ("2"):
                countDownTime += 4000;
                break;
            case ("3"):
                countDownTime += 8000;
                break;
            case ("4"):
                countDownTime += 12000;
                break;
            case ("5"):
                countDownTime += 16000;
                break;
            default:
        }
    }

    $("#progressBar").removeClass("paused");
    $("#progressBar").addClass("animate");

    timeInterval = setInterval(function () {
        let currentAttempts = localStorage.getItem("attemptNumber");
        if (parseInt(currentAttempts) > parseInt(attempts)) {
            switch (currentAttempts) {
                case ("1"):
                    countDownTime += 1000;
                    break;
                case ("2"):
                    countDownTime += 2000;
                    break;
                case ("3"):
                    countDownTime += 4000;
                    break;
                case ("4"):
                    countDownTime += 4000;
                    break;
                case ("5"):
                    countDownTime += 4000;
                    break;
                default:
            }
            attempts = currentAttempts;
        }
        let now = new Date().getTime();
        let timeLeft = countDownTime - now;

        timeLeftGlobal = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timeInterval);
            pauseSong();
            $("#pauseButton").hide();
            $("#playButton").show();
            timeLeftGlobal = 0;
            $("#progressBar").removeClass("animate");
        }
    }, 1);

    timerTextInterval = setInterval(function () {
        counterLocal += 10;
        if (Math.floor(counterLocal / 1000) > counterGlobal) {
            counterGlobal++;
            let secondsPlayed = counterGlobal;
            if (counterGlobal < 10) {
                secondsPlayed = "0" + secondsPlayed;
            }
            $("#currentTimePlayingText").text("0:" + secondsPlayed);
        }

        if (timeLeftGlobal <= 0) {
            clearInterval(timerTextInterval);
            counterGlobal = 0;
            counterLocal = 0;
            $("#currentTimePlayingText").text("0:00");
        }
    }, 10);
}

// Keeping this here for potential future development
function handlePauseSongResponse() { }

function pauseSong() {
    localStorage.setItem("currentlyPlaying", "false");

    $("#progressBar").addClass("paused");

    paused = "true";
    $("#pauseButton").hide();
    $("#playButton").show();
    let url;
    if (deviceId) {
        url = PAUSE_SONG + "?device_id=" + deviceId;
    }
    callAPI("PUT", PAUSE_SONG, null, handlePauseSongResponse);
}

function handleGetDevicesResponse() {
    if (this.status == 200) {
        let data = JSON.parse(this.responseText);
        let devicesArray = data.devices;
        if (devicesArray.length > 0) {
            deviceId = devicesArray[0].id;
        }
    } else if (this.status == 401) {
        requestAuthorization();
    }
}

function getDevices() {
    callAPI("GET", GET_DEVICES, null, handleGetDevicesResponse);
}

function filterSearch(searchInput) {
    $("#chosenSongId").val('');
    let search = searchInput.value.toLowerCase();
    if (search.trim() != '') {
        $("#songsDropdown").addClass('show');
    } else {
        $("#songsDropdown").removeClass('show');
    }

    let songsList = $("#myUL").children('li');
    for (let i = 0; i < songsList.length; i++) {
        let a = songsList[i].firstChild;
        if (a.innerHTML.toLowerCase().indexOf(search) > -1) {
            songsList[i].style.display = "";
        } else {
            songsList[i].style.display = "none";
        }
    }
}

function setSongDropdown() {
    for (let i = 0; i < songArray.length; i++) {
        let song = songArray[i];
        let elem = document.createElement("a");
        elem.href = "#";
        elem.addEventListener('click', function () {
            selectSong(this);
        });
        elem.textContent = song.track.name + " (";
        for (let j = 0; j < song.track.artists.length; j++) {
            if (j == song.track.artists.length - 1) {
                elem.textContent += song.track.artists[j].name + ")";
            } else {
                elem.textContent += song.track.artists[j].name + ", ";
            }
        }
        elem.value = song.track.id;
        let listElem = document.createElement("li");
        listElem.appendChild(elem);
        $("#myUL").append(listElem);
    }
}

function selectSong(anchorTag) {
    $("#searchInput").val(anchorTag.textContent);
    $("#chosenSongId").val(anchorTag.value);
}

function checkGuess() {
    let guessedSongId = $("#chosenSongId").val();
    let guessedSongText = $("#searchInput").val();
    let storageAttempts = localStorage.getItem("attemptNumber");
    let localCurrentAttempts = storageAttempts ? parseInt(storageAttempts) + 1 : 1;

    let guessedSongObject = songArray.filter(song => {
        return song.track.id == guessedSongId;
    });

    let guessedArtists = guessedSongObject[0].track.artists;
    let guessedArtistNames = [];

    guessedArtists.forEach(function (artist) {
        guessedArtistNames.push(artist.name);
    });

    $("#guessBox" + localCurrentAttempts).children(".guessedSongText").text(guessedSongText);

    correct = false;
    partiallyCorrect = false;

    if (guessedSongId == randomSong.track.id) {
        correct = "true";
        $("#guessBox" + localCurrentAttempts).children(".correct").attr('hidden', false);
        localStorage.setItem("guessBox" + localCurrentAttempts, "correct");
    } else {
        randomSong.track.artists.every(artist => {
            if (guessedArtistNames.includes(artist.name)) {
                partiallyCorrect = "true";
                $("#guessBox" + localCurrentAttempts).children(".partiallyCorrect").attr('hidden', false);
                localStorage.setItem("guessBox" + localCurrentAttempts, "partial");
                return false;
            }
            return true;
        });
    }

    if (!correct && !partiallyCorrect) {
        $("#guessBox" + localCurrentAttempts).children(".wrong").attr('hidden', false);
        localStorage.setItem("guessBox" + localCurrentAttempts, "wrong");
    }

    $("#guessBox" + localCurrentAttempts).children(".guessedSongText").attr('hidden', false);
    localStorage.setItem("guessBox" + localCurrentAttempts + "Text", guessedSongText);

    let index = localCurrentAttempts + 1;
    $("#play" + index).css("background-color", "rgb(65, 65, 65)");

    setUpdatedSkipText(storageAttempts);

    if (correct == "true") {
        return true;
    }
    return false;
}

function setUpdatedSkipText(attempts) {
    let updatedText;
    switch (attempts) {
        case (null):
            updatedText = "SKIP (+2s)";
            break;
        case ("1"):
            updatedText = "SKIP (+4s)";
            break;
        case ("2"):
            updatedText = "SKIP (+4s)";
            break;
        case ("3"):
            updatedText = "SKIP (+4s)";
            break;
        case ("4"):
            updatedText = "SKIP (+4s)";
            break;
        default:
    }

    $("#skipButton").text(updatedText);
    localStorage.setItem("skipText", updatedText);
}

function finishGame() {
    if (paused && paused != "true") {
        pauseSong();
    }

    for (let i = 0; i <= 6; i++) {
        let guess = localStorage.getItem("guessBox" + i);
        switch (guess) {
            case ("wrong"):
                $("#resultGuess" + i).attr('style', 'background-color: red;');
                break;
            case ("skip"):
                $("#resultGuess" + i).attr('style', 'background-color: rgb(65, 65, 65);');
                break;
            case ("partial"):
                $("#resultGuess" + i).attr('style', 'background-color: yellow;');
                break;
            case ("correct"):
                $("#resultGuess" + i).attr('style', 'background-color: green;');
                break;
            default:
        }
    }

    let attempts = localStorage.getItem("attemptNumber");

    if (correct == "true") {
        $("#resultMessage").text("You won in " + attempts + " attempt(s)!");
    } else {
        $("#resultMessage").text("You did not guess the correct song :(");
    }

    $("#game").attr('hidden', true);
    $("#results").attr('hidden', false);
}

function enableButtons() {
    $("#playButton").prop("disabled", false);
    $("#skipButton").prop("disabled", false);
    $("#resetButton").prop("disabled", false);
    $("#submitButton").prop("disabled", false);

    let currentlyPlaying = localStorage.getItem("currentlyPlaying");
    if (currentlyPlaying && currentlyPlaying == "true") {
        pauseSong();
    }
}