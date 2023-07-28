import { useState, useRef } from 'react';
import './App.css';
import { Button } from 'react-bootstrap';
import { toPng } from "html-to-image";
import {isMobile} from 'react-device-detect';

export default function ShareableResults(props) {

    const [ shareDisplay, setShareDisplay ] = useState(false);

    const elementRef = useRef(null);

    const htmlToImageConvert = (elementRef) => {
        setShareDisplay(true);
        toPng(elementRef.current, { cacheBust: false })
          .then((dataUrl) => {
            const link = document.createElement("a");
            link.download = "ranked-results.png";
            link.href = dataUrl;
            link.click();
            setShareDisplay(false);
          })
          .catch((err) => {
            console.log(err);
            setShareDisplay(false);
          });
      };

      console.log(props)


  return (
    <div>
    <div ref={elementRef}> 
    <div  class="row2" style={{"display":"flex", "flex-direction":"row", "justify-content":"center", "padding-bottom":"5vh"}}>
        {props.records.map((record, i) => {
            return (
            <div className="column-2" style={{"display":"flex", "flex-direction":"column", "max-width":"33.33%"}}>
                <div style={{"padding-bottom":"5px", "font-family": "Verdana", "flex": "1 1 auto", "font-size":"3vw" }}>{record.name}</div>
                <div className="shareResImg" style={{"position":"relative"}}>
                <div className="rank-text-container" style={{"font-size": "100%", "position": "absolute", "top":"50%", "left":"50%", "transform": "translate(-50%,-50%)", "width":"100%", "height":"100%", "background-color": "rgba(0,0,0,.5)"}}>
                    <div className="rank-text-3">{i+1}</div>
                </div>
                <img src={props.trackMode ? props.trackUrl : record.images[0].url} alt={record.name} style={{"width":"100%"}}/>
                </div>
            </div>);
        })}
    </div>
    {shareDisplay && <p><div>https://gerrifox28.github.io/Record-Ranker/</div><div>#RecordRanker</div></p>}
        </div>
    {!isMobile && <Button onClick={() => htmlToImageConvert(elementRef)}>Download Ranking</Button>}
    </div>
    );

}