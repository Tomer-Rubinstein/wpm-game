import "./RecommendationCard.css";
import ReactPlayer from 'react-player/youtube'
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";
import PlayIcon from "./PlayIcon";

export default function RecommendationCard({songUrl, songTitle, subtext}) {

    return (
        <div className="cardBackground">
            <Link to={`/game?ytSongID=${songUrl}`}>
                <ReactPlayer
                    url={songUrl}
                    light={true}
                    playing={false}
                    controls={false}
                    width="300px"
                    playIcon={<PlayIcon subtext={subtext}/>}
                    height="200px"
                />
            </Link>

            <div>
                <Marquee autoFill={true} speed={30}>
                    <p style={{paddingRight: "30px"}}>{songTitle}</p>
                </Marquee>
            </div>
        </div>
    );
}
