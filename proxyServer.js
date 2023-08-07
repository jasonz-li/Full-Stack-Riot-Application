var express = require('express');
var cors = require('cors');
const axios = require('axios');

var app = express();

app.use(cors())

const api_key = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

// GET past5 games
// localhost:4000/past5Games

function getPlayerPUUID(playerName) {
    return axios.get("https://na1.api.riotgames.com" + "/lol/summoner/v4/summoners/by-name/" + playerName + "?api_key=" + api_key)
    .then(response => {
        console.log(response.data)
        return response.data.puuid
    }).catch(err => err);
}

app.get('/searchForPlayer', async (req, res) => {
    const playerName = req.query.username;
    const api_call = "https://na1.api.riotgames.com" + "/lol/summoner/v4/summoners/by-name/" + playerName + "?api_key=" + api_key
    

    const playerData = await axios.get(api_call)    
        .then(response => response.data)
        .catch(err => err);
    res.json(playerData);

})


app.get('/past5Games', async (req, res) => {
    const playerName = req.query.username;
    // PUUID
    const puuid = await getPlayerPUUID(playerName);
    const api_call = "https://americas.api.riotgames.com" + "/lol/match/v5/matches/by-puuid/" + puuid + "/ids" + "?api_key=" + api_key

    //GET api_call
    // give us a list of game ids
    const gameIDs = await axios.get(api_call)
        .then(response => response.data)
        .catch(err => err)

    // a list of game ID strings
    console.log(gameIDs);

    //loop through game ids
    // at each loop, get info based off id (api_call)
    var matchDataArray = [];
    for (var i = 0; i < gameIDs.length - 15; i++){
        const matchID = gameIDs[i]
        const matchData = await axios.get("https://americas.api.riotgames.com" + "/lol/match/v5/matches/" + matchID + "?api_key=" + api_key)
            .then(response => response.data)
            .catch(err => err)
        matchDataArray.push(matchData);
    }

    // save info above in array, give array as json response to user
    // [Game1Object, Game2 Object, etc...]
    res.json(matchDataArray);
});

app.listen(4000, function () {
    console.log("Server started on port 4000!")
}); //localhost:4000