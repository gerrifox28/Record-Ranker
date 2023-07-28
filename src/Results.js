import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useRef } from 'react';
import { Container, Row, Card, Button } from 'react-bootstrap';
import { toPng } from "html-to-image";
import ShareableResults from './ShareableResults';

function Results(props) {

    const [ noImageResults, setNoImageResults ] = useState(false);
    const [ removeOpacity, setRemoveOpacity ] = useState(false);

    const elementRefSimple = useRef(null);
    const elementRefVisual = useRef(null);

    const htmlToImageConvert = (elementRef) => {
        setRemoveOpacity(true);
        toPng(elementRef.current, { cacheBust: false })
          .then((dataUrl) => {
            const link = document.createElement("a");
            link.download = "ranked-results.png";
            link.href = dataUrl;
            link.click();
            setRemoveOpacity(false);
          })
          .catch((err) => {
            console.log(err);
            setRemoveOpacity(false);
          });
      };

    function startOver() {
        props.setRankingMode(false);
        props.setRecords([]);
        props.setTracks([]);
        props.setTrackMode(false);
        props.setSubtitle("Search for an artist on Spotify to start a series of battles to determine your ranking of their records.");
      }

      function renderNoImageResults() {
        let records = props.trackMode ? props.tracks : props.records;
        return (
            <div>
            <div ref={elementRefSimple}>
            <table  style={{"width":"200px", "font-size":"18px", "line-height":"120%", "margin-left":"auto", "margin-right":"auto", "border":"1px solid #b393d3", "border-collapse":"collapse", "margin-bottom":"20px"}} align="center">
                <tbody >
                    <tr>
                        <td style={{"color":"#ffffff", "background-color":"#b393d3", "text-align":"center"}}>Rank</td>
                        <td style={{"color":"#ffffff", "background-color":"#b393d3", "text-align":"center"}}>Song</td>
                    </tr>
                    {
                    records.map((record, i) => {
                        return (
                            <tr>
                                <td style={{"border":"1px solid #b393d3", "text-align":"center", "padding-right":"5px"}}>{i+1}</td>
                                <td style={{"border":"1px solid #b393d3", "padding-left":"5px"}}>{record.name}</td>
                            </tr>
                        )
                    })
                    
                    }
                </tbody>
            </table>
            </div>
            <Button onClick={() => htmlToImageConvert(elementRefSimple)}>Download Ranking</Button>
            </div>
        )
      }
    return (
        <div className="Results" style={{"padding-bottom": "50px"}}>
            <Container>
                {noImageResults ? renderNoImageResults() : 
                <div>
                    {props.trackMode ? <ShareableResults records={props.tracks} trackMode={props.trackMode} trackUrl={props.trackUrl}/> : <ShareableResults records={props.records} trackMode={props.trackMode} trackUrl={props.trackUrl}/> }
            {/* {props.trackMode ? 
                <Row ref={elementRefVisual} className="mx-2 row justify-content-center" >
                {props.tracks.map( (track, i) => {
                return (
                    <div className="col-sm-6 col-lg-3" style={{"display": "flex"}}>
                <Card>
                    {removeOpacity ? 
                    <div className="content-img">
                        <Card.Img src={props.trackUrl} />
                        <div className="rank-2"><div className="rank-text-2">{i+1}</div></div>
                    </div>
                    :
                    <div className="content-img">
                        <Card.Img src={props.trackUrl} />
                        <div className="rank"><div className="rank-text">{i+1}</div></div>
                    </div>
                }
                    <Card.Body>
                    <Card.Title style={{"padding-bottom": "20px"}}>{track.name}</Card.Title>
                    </Card.Body>
                </Card>
                </div>)
                })}
            </Row>
                :
            <Row ref={elementRefVisual} className="mx-2 row justify-content-center" >
                {props.records.map( (record, i) => {
                return (
                    <div className="col-sm-6 col-lg-3" style={{"display": "flex"}}>
                <Card>
                    <div className="content-img">
                        <Card.Img src={record.images[0].url} />
                        <div className="rank"><div className="rank-text">{i+1}</div></div>
                    </div>
                    <Card.Body>
                    <Card.Title style={{"padding-top": "20px"}}>{record.name}</Card.Title>
                    </Card.Body>
                </Card>
                </div>)
                })}
            </Row>} */}
            {/* <Button onClick={() => htmlToImageConvert(elementRefVisual)}>Download Ranking</Button> */}

            </div>}
            {/* <Button onClick={() => htmlToImageConvert(elementRefVisual)}>Download Ranking</Button> */}
            </Container>
            <Button onClick={()=> setNoImageResults(!noImageResults)}>{noImageResults ? "Visual Results" : "Simple Results"}</Button>
            <Button onClick={startOver}>Start Over</Button>
        </div>
    );
}

export default Results;