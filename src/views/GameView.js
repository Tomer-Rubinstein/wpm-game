import "./GameView.css";
import { fetchSubtitles } from '../utils/subtitles';
import React from "react";
import LoadingComp from "../components/LoadingComp";
import LyricsPromptComp from "../components/LyricsPromptComp";
import ReactPlayer from 'react-player/youtube'

/*
TODO:
- Play song on background (will there be ads tho?)
- show subtitles on sync
- the typing functionality and make it satisfying
- lyrics parsing (decoding and such)
- Mute button
- Pause button and escape shortcut
- restart button and shortcut
- radio button: "Case sensitive YES/NO"
*/


class GameView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {subtitles: null, playing: false};
    }

    componentDidMount() {
        this.getSubtitles();
    }

    getSubtitles = async () => {
        try {
            const subtitles = await fetchSubtitles(this.props.ytSongID);
            this.setState({
                subtitles: subtitles
            });
        } catch (err) {
            console.log(err);
        }
    }

    startGame = () => {
        this.setState({playing: true})
    }

    render() {
        console.log(this.state.subtitles);
        return (
            <div className="background">
                <meta content="text/html;charset=utf-8"></meta>

                <div className="header">
                    <h3 style={{fontSize: 26}}>Now Playing...
                        <p style={{
                            display: "inline",
                            fontStyle: "italic",
                            fontSize: 32,
                            color: "wheat"
                        }}> "{this.props.songTitle}"</p>
                    </h3>
                    <p style={{fontSize: 18, color: "rgba(255, 255, 255, 0.5)"}}>
                        Press <code style={{backgroundColor: "rgba(128, 128, 128, 0.548)", borderRadius: 5, color: "white"}}>Esc</code> to pause
                    </p>
                </div>
                
                <div className="game" style={{width: "50%"}}>
                    { this.state.subtitles == null
                    ? <LoadingComp/>
                    : <LyricsPromptComp subtitles={this.state.subtitles} isPlaying={this.state.playing}/> }
                </div>

                <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${this.props.ytSongID}`}
                    volume={.1}
                    width="0px"
                    height="0px"
                    playing={this.state.playing}
                />
                <button onClick={this.startGame}>start</button>
            </div>

        );
    }
}

export default GameView;
