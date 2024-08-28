import "./RecommendationCard.css";
import ReactPlayer from 'react-player/youtube'
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";

export default function RecommendationCard(props) {
    const songUrl = props.songUrl;
    const songTitle = props.songTitle;

    return (
        <div className="cardBackground">
            <Link to={`/game?ytSongID=${songUrl}`}>
                <ReactPlayer
                    url={songUrl}
                    light={true}
                    playing={false}
                    controls={false}
                    width="300px"
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
