import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState } from 'react';

function Search(props) {

    const [ searchInput, setSearchInput ] = useState("Search For Artist");
    const [ songPreview, setSongPreview ] = useState("Play Preview");
    const [ audio, setAudio ] = useState("");
    const [ previewTrackName, setPreviewTrackName ] = useState("");

    var searchParameters = {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.accessToken
        }
    }

    // Search
  async function searchAlbums() {
    console.log("Search for " + searchInput);
    
    // Get request using search to get the Artist ID
    try {

        var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
        .then(response => response.json())
        .then(data =>  { 
            console.log(data);
            return data.artists.items[0].id 
        })

        console.log(artistID)
        
        // Get request with Artist ID grab all albums from that artist
        var returnedRecords = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.items.length === 0) {
                props.setErrorMode(true);
                props.setErrorMessage("Sorry, " + searchInput + " has no albums on Spotify. Search again for a different artist.");
            } else {
            props.setRecords(data.items);
            props.setSubtitle("Customize your records to rank before starting the battles. Select an album to rank its tracks, or search again if this artist isn't who you're looking for.")
            }
        })
    } catch (error) {
        console.log("error with searching for artist");
        props.setErrorMode(true);
        props.setErrorMessage("Error searching, please reload the page and try again. Make sure your search input is correct.");
    }
    }
    

      // remove album from list
    async function deleteRecord(event, record) {
        console.log('Record to remove is: ' + record.name);
        props.trackMode ? 
        props.setTracks(props.tracks.filter(function removeRecord(recordInList) {
            if (recordInList.name !== record.name) {
                return recordInList;
            }
            }))
        :
        props.setRecords(props.records.filter(function removeRecord(recordInList) {
        if (recordInList.name !== record.name) {
            return recordInList;
        }
        }))
    }

    async function rankTracks(event, record) {
        console.log("rank tracks");
        console.log(record);
        var albumId = record.id;
        props.setTrackUrl(record.images[0].url);

        try {
            // Get request with Artist ID grab all tracks from that album
            
        var returnedTracks = await fetch('https://api.spotify.com/v1/albums/'+ albumId + '/tracks?offset=0&limit=50', searchParameters)
        .then(response => response.json())
        .then(data => {
            props.setTracks(data.items);
            props.setTrackMode(true);
            console.log('Tracks:');
            console.log(data.items)
            props.setSubtitle("Customize your ranking list if you wish prior to starting the battles.")
        })
        } catch (error) {
            console.log("error with retrieving tracks");
            props.setErrorMode(true);
            props.setErrorMessage("Error retrieving tracks. Please reload and search again.");

        }
    }

    function startOver() {
        setSearchInput(false);
        props.setErrorMode(false);
        props.setErrorMessage("Error searching, please reload the page and try again. Make sure your search input is correct.");
        props.setSubtitle("Search for an artist on Spotify to start a series of battles to determine your ranking of their records.");
    }

    function goBack() {
        props.setTrackMode(false);
        props.setSubtitle("Customize your records to rank before starting the battles. Select an album to rank its tracks, or search again if this artist isn't who you're looking for.")

    }

    function playPreview(event, track) {
        if (track.preview_url === null) {
            alert("Sorry, Spotify doesn't provide a preview for this track.");
        } else {
            if (songPreview === "Play Preview") {
                let audio = new Audio(track.preview_url);
                setAudio(audio);
                setSongPreview("Stop Preview");
                setPreviewTrackName(track.name);
                audio.play();
            } else {
                audio.pause();
                setAudio("");
                setSongPreview("Play Preview");
                setPreviewTrackName("");
            }
        }
    }

  return (

    <div className="Search" style={{"padding": "50px"}}>
        {props.errorMode ? <div>
            {props.errorMessage}
            <Button onClick={startOver}>
                Start Over
                </Button>
            </div> : 
        <div>
            {props.trackMode ? <Button onClick={goBack}>Go Back to Artist Page</Button> :
             <Container>
            <InputGroup className="mb-3" size="lg">
                <FormControl 
                placeholder={searchInput}
                type='input' 
                onKeyDown={event => {
                    if (event.key === "Enter") {
                        searchAlbums();
                    }
                }}
                onChange={ event => setSearchInput(event.target.value) }
                />
                <Button onClick={searchAlbums}>
                Search
                </Button>
            </InputGroup>
            </Container>}

            <Container>
                {props.trackMode ? 
                <Row className="mx-2 row justify-content-center" >
                {props.tracks.map( (track, i) => {
                return (
                    <div className="col-sm-6 col-lg-3" style={{"display": "flex"}}>
                <Card>
                    <Card.Img src={props.trackUrl}/>
                    <Card.Body>
                    <Card.Title>{track.name}</Card.Title>
                    </Card.Body>
                    <Button onClick={event => deleteRecord(event, track)}>
                    Remove Track
                    </Button>
                    <Button onClick={event => playPreview(event, track)}> 
                    {previewTrackName === track.name ? "Stop Preview" : "Play Preview"}
                    </Button>
                </Card>
                </div>)
                })}
            </Row>
                :
            <Row className="mx-2 row justify-content-center" >
                {props.records.map( (record, i) => {
                return (
                    <div className="col-sm-6 col-lg-3" style={{"display": "flex"}}>
                <Card>
                    <Card.Img src={record.images[0].url} />
                    <Card.Body>
                    <Card.Title>{record.name}</Card.Title>
                    </Card.Body>
                    <Button onClick={event => deleteRecord(event, record)}>
                    Remove Album
                    </Button>
                    <Button onClick={event => rankTracks(event, record)}>
                    Rank or Preview Tracks
                    </Button>
                </Card>
                </div>)
                })}
            </Row>}
            </Container>
            {(props.records.length > 0 || props.tracks.length > 0) && <Button onClick={props.setRankingMode}>Start Ranking!</Button> }
        </div> }
        </div>
  );
}

export default Search;