import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Container, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Results from './Results';

function Ranker(props) {

    const [ battles, setBattles ] = useState([]);
    const [ battleIdx, setBattleIdx ] = useState(0);
    const [ scores, setScores ] = useState({});
    const [ record1, setRecord1 ] = useState("");
    const [ record2, setRecord2 ] = useState("");
    const [ record1Img, setRecord1Img ] = useState("");
    const [ record2Img, setRecord2Img ] = useState("");
    const [ record1Audio, setRecord1Audio ] = useState("");
    const [ record2Audio, setRecord2Audio ] = useState("");
    const [ rankingOver, setRankingOver ] = useState(false);
    const [ progress, setProgress ] = useState(0);
    const [ tieBreak, setTieBreak ] = useState(false);
    const [ songPreview, setSongPreview ] = useState("Play Preview");
    const [ audio, setAudio ] = useState("");
    const [ previewTrackName, setPreviewTrackName ] = useState("");

    useEffect(() => {
        var newRecords = props.trackMode ? props.tracks : props.records;
        var scores = {}
        newRecords.forEach(record => scores[record.name] = 0)
        setScores(scores);

        if (newRecords.length < 1) {
          alert("No records to rank. Please reload the page.");
        }

        else if (newRecords.length === 1) {
          console.log(scores);
          scores[newRecords[0].name] = 1
          setScores(scores);
          console.log("battles over");
          finalResults([newRecords[0].name]);
        } 

        else {

        var battles = []
        for(let i = 0 ; i < newRecords.length; i++){
          for(let j = 0 ; j < newRecords.length ; j++){
            if (i !== j && i < j) {
              battles.push([newRecords[i], newRecords[j]])
            }
          }
        }

        const shuffledBattles = battles.sort(() => Math.random() - 0.5);
        setBattles(shuffledBattles);
        setRecord1(shuffledBattles[0][0].name);
        setRecord1Img(props.trackMode ? props.trackUrl : shuffledBattles[0][0].images[0].url)
        setRecord2(shuffledBattles[0][1].name);
        setRecord2Img(props.trackMode ? props.trackUrl : shuffledBattles[0][1].images[0].url)
        if (props.trackMode) {
          setRecord1Audio(shuffledBattles[0][0].preview_url);
          console.log(shuffledBattles[0][1].preview_url)
          setRecord2Audio(shuffledBattles[0][1].preview_url);
        }
        setProgress(0);
        props.setSubtitle("Of the following two records, select which one you prefer.");
      }
      }, [])

    function makeBattles(newRecords) {
        setProgress(0)
    
        var battles = []
        for(let i = 0 ; i < newRecords.length; i++){
          for(let j = 0 ; j < newRecords.length ; j++){
            if (i !== j && i < j) {
              battles.push([newRecords[i][0], newRecords[j][0]])
            }
          }
        }
        console.log(battles);
        const shuffledBattles = battles.sort(() => Math.random() - 0.5);
        console.log(shuffledBattles);
        setBattles(shuffledBattles);
        setRecord1(shuffledBattles[0][0].name);
        setRecord1Img(props.trackMode ? props.trackUrl : shuffledBattles[0][0].images[0].url)
        setRecord2(shuffledBattles[0][1].name);
        setRecord2Img(props.trackMode ? props.trackUrl : shuffledBattles[0][1].images[0].url)
        if (props.trackMode) {
          setRecord1Audio(shuffledBattles[0][0].preview_url);
          setRecord2Audio(shuffledBattles[0][1].preview_url);
        }
      }
    
      function nextBattle(event, record) {
        // console.log('Battle Index: ' + battleIdx);
        scores[record] += 1;
        setScores(scores);
        if (battleIdx+1 >= battles.length) {
          console.log("break ties?")
          console.log(scores);
          breakTies(scores);
        } else {
          setRecord1(battles[battleIdx+1][0].name);
          setRecord1Img(props.trackMode ? props.trackUrl : battles[battleIdx+1][0].images[0].url)
          setRecord2(battles[battleIdx+1][1].name);
          setRecord2Img(props.trackMode ? props.trackUrl : battles[battleIdx+1][1].images[0].url)
          if (props.trackMode) {
            setRecord1Audio(battles[battleIdx+1][0].preview_url);
            setRecord2Audio(battles[battleIdx+1][1].preview_url);
          }
          setBattleIdx(battleIdx+1);
          setProgress(progress + 1)
        }
      }
    
      function breakTies(scores) {
        var tiedRecords = findNextTie(scores)
        //console.log(tiedRecords)
        var records = props.trackMode ? props.tracks : props.records;
        var tiedRecordsInfo = tiedRecords.map(recordName => records.filter(record => record.name === recordName));
        //console.log(tiedRecordsInfo);
        if (tiedRecords.length > 1) {
            setTieBreak(true);
            setBattleIdx(0);
            var newBattles = makeBattles(tiedRecordsInfo)
        } else {
          console.log("battles over");
          var sortedScores = Object.keys(scores).sort(function(a,b){return scores[b]-scores[a]})
          console.log(sortedScores);
          finalResults(sortedScores);
          // sortResults(scores);
          // props.setRankingMode(false);
          
        }
      }
    
    
      function findNextTie(scores) {
        var sortedScores = sortResults(scores);
        console.log('NEXT TIE');
        console.log(sortedScores);
        var minScore = scores[sortedScores[0]];
        console.log('min score ' + minScore)
        var ties = []
        sortedScores.forEach(record => {
          if (scores[record] === minScore) {
            console.log('same: ' + record)
            console.log('ties: ' + ties)
            ties.push(record);
          } else if (scores[record] > minScore && ties.length <= 1) { // no tie at this score
            console.log('no tie')
            minScore = scores[record];
            ties = [record];
          } else { // found ties to evaluate
            console.log('return')
            return ties;
          }
        })
        return ties;
      }
    
      function sortResults(scores) {
        var sortedScores = Object.keys(scores).sort(function(a,b){return scores[a]-scores[b]})
        // setRecords(sortedScores);
    
        return sortedScores;
      }
    
      function finalResults(scores) {
        var finals = []
        console.log('scores in final results: ' + scores);
        console.log(scores)
        scores.forEach(recordName => {
            var records = props.trackMode ? props.tracks : props.records;
          records.filter(function findRecord(recordInList) {
              if (recordInList.name === recordName) {
                finals.push(recordInList)
              }
            })
          }
        )  
        console.log(finals);
        console.log('track mode: ' + props.trackMode);
        props.trackMode ? props.setTracks(finals) : props.setRecords(finals);
        setRankingOver(true);
        props.setResults(true);
        props.setSubtitle("Share your results! Screenshotting and sharing on social media is encouraged #RecordRanker");
      }    

      function playPreview(event, previewUrl, trackName) {
        if (songPreview === "Play Preview") {
            let audio = new Audio(previewUrl);
            setAudio(audio);
            setSongPreview("Stop Preview");
            setPreviewTrackName(trackName);
            audio.play();
        } else {
            audio.pause();
            setAudio("");
            setSongPreview("Play Preview");
            setPreviewTrackName("");
        }
    }

    function startOver() {
      props.setRankingMode(false);
      props.setSubtitle("Search for an artist on Spotify to start a series of battles to determine your ranking of their records.");
  }


    return (
        <div className="Ranker" style={{"padding-bottom": "50px"}}>
            {rankingOver ? <Results records={props.records} setRankingMode={props.setRankingMode} setRecords={props.setRecords} setTracks={props.setTracks} setTrackMode={props.setTrackMode} tracks={props.tracks} trackMode={props.trackMode} trackUrl={props.trackUrl} setSubtitle={props.setSubtitle}/> : 
            <div>
        <div className='head3'>{tieBreak && 'Tie Break Mode-- '} Progress: {progress + ' / ' + battles.length}</div>
        <div>
        <Container >
        <Row className="mx-2 row justify-content-center">
          {[[record1, record1Img, record1Audio], [record2, record2Img, record2Audio]].map((recordInfo, i) => {
            return (
              <div className="col-sm-6 col-lg-3" style={{"display": "flex"}}>
                <Card>
              <Card.Img src={recordInfo[1]} />
              <Card.Body>
              <Card.Title>{recordInfo[0]}</Card.Title>
              </Card.Body>
              <Button onClick={event => nextBattle(event, recordInfo[0])}>
              Select
              </Button>
              {props.trackMode && <Button onClick={event => playPreview(event, recordInfo[2], recordInfo[0])}> 
                    {previewTrackName === recordInfo[0] ? songPreview : "Play Preview"}
                    </Button>}
          </Card>
          </div>)
          })}
          {/* <div>
        <Button onClick={event => nextBattle(event, record1)}>
        <Card>
            <Card.Img src={record1Img} />
            <Card.Body>
            <Card.Title style={{"min-height": "50px"}}>{record1}</Card.Title>
            </Card.Body>
            
          </Card>
        </Button>
        {props.trackMode && <Button onClick={event => playPreview(event, record1Audio, record1)}> 
                    {previewTrackName === record1 ? songPreview : "Play Preview"}
                    </Button>}
        </div>
         <div>
         <Button onClick={event => nextBattle(event, record2)}>
        <Card>
            <Card.Img src={record2Img}/>
            <Card.Body>
            <Card.Title style={{"min-height": "50px"}}>{record2}</Card.Title>
            </Card.Body>
          </Card>
        </Button>
        {props.trackMode && <Button onClick={event => playPreview(event, record2Audio, record2)}> 
        {previewTrackName === record2 ? songPreview : "Play Preview"}
                    </Button>}
        </div> */}
        </Row>
        </Container>
        </div>
        <Button onClick={startOver}>
                Exit This Game
                </Button>
        </div>}
      </div>
    );

}

export default Ranker;