import "./Game.css";
import fetchSubtitles from '../utils/Subtitles';
import React from "react";
import LoadingComp from "../components/LoadingComp";
import LyricsPromptComp from "../components/LyricsPromptComp";
import { useLocation } from "react-router-dom";
import { store } from "../utils/GameStore";
import GameSummary from "./GameSummary";


/*
TODO:
- keyboard shortcuts
- volume controls
- restart button
*/


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subtitles: null,
            videoTitle: null,
            errorMsg: null,
            isWin: null,
            accuracyPercentage: 0,
        };

        this.ytSongID = props.ytSongID;

        const YT_VID_ID_LEN = 11; // YouTube video id's are 11 chars long
        const urlLen = this.ytSongID.length;
        if (urlLen > YT_VID_ID_LEN)
            this.ytSongID = this.ytSongID.substring(urlLen-YT_VID_ID_LEN);
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(this.handleStoreChange);
        this.getSubtitles();
    }

    handleStoreChange = () => {
        const isWin = store.getState().gameState.isWin;
        const accuracyPercentage = store.getState().gameState.accuracy;
        this.setState({ isWin: isWin, accuracy: accuracyPercentage });
        this.unsubscribe();
    }

    getSubtitles = async () => {
        const [videoTitle, subtitles] = await fetchSubtitles(this.ytSongID);
        if (videoTitle == null || subtitles == null)
            this.setState({errorMsg: "Could not find subtitles 🙁"});

        this.setState({
            subtitles: subtitles,
            videoTitle: videoTitle,
        });
    }

    render() {
        if (this.state.isWin != null)
            return <GameSummary
                isWin={this.state.isWin}
                accuracyPercentage={store.getState().gameState.accuracy}
            />

        return (
            <div className="background">
                <div className="header">
                    <h3 style={{fontSize: 26}}>Now Playing...
                        <p style={{
                            display: "inline",
                            fontStyle: "italic",
                            fontSize: 32,
                            color: "wheat"
                        }}>"{this.state.videoTitle}"</p>
                    </h3>
                    <p style={{fontSize: 18, color: "rgba(255, 255, 255, 0.5)"}}>
                        Press <code style={{backgroundColor: "rgba(128, 128, 128, 0.548)", borderRadius: 5, color: "white"}}>Esc</code> to pause
                    </p>
                </div>

                <div className="game" style={{width: "50%"}}>
                    <ShowSubtitles
                        state={this.state}
                        ytSongID={this.ytSongID}
                    />
                </div>
            </div>
        );
    }
}

function ShowSubtitles({state, ytSongID}) {
    const isFetchingSubtitles = (state.subtitles == null && state.errorMsg == null);
    const isError = (state.errorMsg != null);

    if (isFetchingSubtitles) return <LoadingComp/>
    if (isError) return <p>{state.errorMsg}</p>
    
    return <LyricsPromptComp
        subtitles={state.subtitles}
        ytSongID={ytSongID}
    />
}

const useQuery = () => {
    const { search } = useLocation();
    return new URLSearchParams(search);
}

const GameWrapper = () => {
    const query = useQuery();
    const ytSongID = query.get("ytSongID");

    return <Game ytSongID={ytSongID}/>
}

export default GameWrapper;
