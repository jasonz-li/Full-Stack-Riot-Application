import React, { useState } from 'react';
import axios from'axios';
import './App.css';

function App() {
  const [searchText, setSearchText] = useState("");
  const [playerData, setPlayerData] = useState({});
  const [gameList, setGameList] = useState([]);
  const [statusCode, setStatusCode] = useState(-1);  

  function searchForPlayer(event){
    axios.get("http://localhost:4000/searchForPlayer", { params: { username: searchText}})
      .then (function (response) {
        setPlayerData(response.data);
        setStatusCode(response.status);
        past5Games(response.data.name);
        console.log("HEY IM HERE", response.status)
      }).catch(function (error) {
        console.log(error);
      })
  }
console.log(statusCode)

  function past5Games(event) {
    // Making apicall to our porxy server
    axios.get("http://localhost:4000/past5Games", { params: { username: searchText}})
      .then(function (response) {
        setGameList(response.data);
      }).catch(function (error) {
        console.log(error);
      })
  }

  return (
    <div className="App">
      <div className="container">
        <h5> League of Legends Player Searcher</h5>
        <input type="text" onChange={e => setSearchText(e.target.value)}></input>
        <button onClick={e => searchForPlayer(e)}>Search for Player</button>
        {playerData && Object.keys(playerData).length !== 0 && statusCode == 200 ?
        <>
          <h1>{playerData.name}</h1>
          <img 
          width="100" 
          height="100" 
          src={"http://ddragon.leagueoflegends.com/cdn/13.14.1/img/profileicon/" + playerData.profileIconId + ".png"}>
          </img>
          <p>Summoner Level {playerData.summonerLevel}</p>
          {
            gameList.map((gameData, index) =>
              <>
                <h2> Game {index + 1}</h2>
                <div>
                    {gameData.info.participants.map((data, participantIndex) =>
                    <p> 
                      <img width="25" 
                      height="25" 
                      src={"http://ddragon.leagueoflegends.com/cdn/13.14.1/img/champion/" + data.championName + ".png"}>
                      </img> {data.championName}, {data.summonerName}, KDA: {data.kills} / {data.deaths} / {data.assists}</p>)}
                </div>
              </>

            )
          }
        </>
        : statusCode == -1 ?   
          <>
          <p>
            <img width="450" height="200" src={process.env.PUBLIC_URL + "/opgglogo.png"}></img>
          </p>
          </>

        :
        <>
          <p>Error loading player data.</p>
          <img width="100" height="100" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Blue_question_mark_icon.svg/2048px-Blue_question_mark_icon.svg.png"></img>
          <p> HERE</p>
        </>}
      </div>

      
    </div>
  );
}

export default App;
