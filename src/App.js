import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import Search from './Search';
import Ranker from './Ranker';
import record from './color-record.png';

function App() {

  const [ accessToken, setAccessToken ] = useState("");
  const [ records, setRecords ] = useState([]);
  const [ rankingMode, setRankingMode ] = useState(false);
  const [ trackMode, setTrackMode ] = useState(false);
  const [ tracks, setTracks ] = useState([]);
  const [ results, setResults ] = useState(false);
  const [ trackUrl, setTrackUrl ] = useState("");
  const [ subtitle, setSubtitle ] = useState("Search for an artist on Spotify to start a series of battles to determine your ranking of their records.");
  const [ errorMode, setErrorMode ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState("Error searching, please reload the page and try again. Make sure your search input is correct.");

  useEffect(() => {
    // API Access Token
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + process.env.REACT_APP_CLIENT_ID + '&client_secret=' + process.env.REACT_APP_CLIENT_SECRET
    }

    try {
      fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
    } catch (error) {
      console.log("error with getting access token");
      setErrorMode(true);
      setErrorMessage("Error searching, please reload the page and try again.");
    }

    
  }, [])

  var rankDescription = results ? "Share your results!" : "Of the following two records, select which one you prefer.";

  var description = rankingMode ? rankDescription : "Search for an artist on Spotify to start a series of battles to determine your ranking of their records."


  return (
    <div className="App">
      <div className='App-logo' align="center"> 
        {/* <a href='home.php' style={{'text-decoration': 'none'}}>  */}
          <img align="left" src={record} alt='Official logo' width='50px' height='50px'/> 
          <div align="right"><a className="linkedin" href='https://www.linkedin.com/in/gerri-fox/' target="_blank">About The Creator</a></div>
        {/* </a>  */}
        <Container>
        <div  className='head'>Record Ranker</div>
        <div  className='head2'>{subtitle}</div>
        </Container>
      </div>
     
      {!rankingMode ? 
      <Search accessToken={accessToken} records={records} setRecords={setRecords} setRankingMode={setRankingMode} trackMode={trackMode} setTrackMode={setTrackMode} tracks={tracks} setTracks={setTracks} setTrackUrl={setTrackUrl} trackUrl={trackUrl} setSubtitle={setSubtitle} errorMode={errorMode} setErrorMode={setErrorMode} errorMessage={errorMessage} setErrorMessage={setErrorMessage}/>
      : 
      <Ranker records={records} setRankingMode={setRankingMode} setRecords={setRecords} trackMode={trackMode} setTrackMode={setTrackMode} tracks={tracks} setTracks={setTracks} setResults={setResults} setTrackUrl={setTrackUrl} trackUrl={trackUrl} setSubtitle={setSubtitle}/> 
    }
    <div className="coffee"><a className="linkedin" href="https://bmc.link/gerrif" target="_blank">{"Buy me a coffee and leave some feedback :)"}</a></div>

    </div>
  );
}

export default App;
