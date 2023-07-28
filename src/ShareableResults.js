import { useState, useRef } from 'react';
import './App.css';
import { Button } from 'react-bootstrap';
import record from './color-record.png';

import { toPng } from "html-to-image";

export default function ShareableResults(props) {

    const [ buttonText, setButtonText ] = useState("Download Ranking");

    const elementRef = useRef(null);

    const htmlToImageConvert = (elementRef) => {
        setButtonText("gerrifox28.github.io/Record-Ranker/");
        toPng(elementRef.current, { cacheBust: false })
          .then((dataUrl) => {
            const link = document.createElement("a");
            link.download = "ranked-results.png";
            link.href = dataUrl;
            link.click();
            setButtonText("Download Ranking");
          })
          .catch((err) => {
            console.log(err);
          });
      };

      console.log(props)


  return (
    <div ref={elementRef}> 
    <div class="row2" style={{"display":"flex"}}>
        {props.records.map((record, i) => {
            return (
            <div className="column-2" style={{"display":"flex", "flex-direction":"column"}}>
                <div style={{"padding-bottom":"5px", "font-family": "Verdana", "flex": "1 1 auto", "font-size":"3vw" }}>{record.name}</div>
                {/* <div className="shareResImg" style={{"position":"relative"}}> */}
                {/* <div className="rank-text-container" style={{"font-size": "100%", "position": "absolute", "top":"50%", "left":"50%", "transform": "translate(-50%,-50%)", "width":"100%", "height":"100%", "background-color": "rgba(0,0,0,.5)"}}> */}
                    <div className="rank-text-3">{i+1}</div>
                {/* </div> */}
                <img src={props.trackMode ? props.trackUrl : record.images[0].url} alt={record.name} style={{"width":"100%"}}/>
                {/* </div> */}
            </div>);
        })}
    </div>
    <Button onClick={() => htmlToImageConvert(elementRef)}>{buttonText}</Button>
    </div>
    );

}