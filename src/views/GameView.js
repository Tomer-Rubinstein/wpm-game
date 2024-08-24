import "./GameView.css";
import { fetchSubtitles } from '../utils/Subtitles';
import React from "react";
import LoadingComp from "../components/LoadingComp";
import LyricsPromptComp from "../components/LyricsPromptComp";

/*
TODO:
- Play song on background [DONE]
- show subtitles on sync [DONE]
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
        this.state = {subtitles: null};
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

    render() {
        return (
            <div className="background">
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
                        :   <div>
                                <LyricsPromptComp
                                    subtitles={this.state.subtitles}
                                    ytSongID={this.props.ytSongID}
                                />
                            </div> }
                </div>
            </div>

        );
    }
}

export default GameView;
