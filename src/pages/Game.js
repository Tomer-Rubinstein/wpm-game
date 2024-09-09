import "./Game.css";
import fetchSubtitles from '../utils/Subtitles';
import React from "react";
import LoadingComp from "../components/LoadingComp";
import LyricsPromptComp from "../components/LyricsPromptComp";
import { useLocation } from "react-router-dom";
import { store } from "../utils/GameStore";
import GameSummary from "./GameSummary";
import { IconButton, Tooltip } from '@mui/material';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import Box from '@mui/material/Box';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subtitles: null,
            videoTitle: null,
            errorMsg: null,
            isWin: null,
            accuracyPercentage: 0,
            volume: 30,
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

    shortenVideoTitle = (title) => {
        const prefix = "...";
        const maxTitleLen = 30;

        if (title.length > maxTitleLen)
            title = title.substring(0, maxTitleLen) + prefix;
        
        return title;
    }

    getSubtitles = async () => {
        const [videoTitle, subtitles] = await fetchSubtitles(this.ytSongID);
        if (videoTitle == null || subtitles == null)
            this.setState({errorMsg: "Could not find subtitles 🙁"});

        const shortenedVideoTitle = this.shortenVideoTitle(videoTitle);

        this.setState({
            subtitles: subtitles,
            videoTitle: shortenedVideoTitle,
        });
    }

    handleChange = (event, newVolume) => {
        this.setState({volume: newVolume});
    }

    render() {
        if (this.state.isWin != null)
            return <GameSummary
                isWin={this.state.isWin}
                accuracyPercentage={store.getState().gameState.accuracy}
            />

        const isFetchingSubtitles = (this.state.subtitles == null && this.state.errorMsg == null);
        if (isFetchingSubtitles)
            return <LoadingComp/>

        const theme = createTheme({
            palette: {
                primary: {
                    main: "#FFFFFF",
                },
            }
        });

        return (
            <div className="background">
                <div className="header">
                    <h3 style={{fontSize: 26}}>Now Playing
                        <p style={{
                            display: "inline",
                            fontStyle: "italic",
                            fontSize: 32,
                            color: "wheat"
                        }}> "{this.state.videoTitle}"</p>
                    </h3>

                    <div className="controls">
                        <ThemeProvider theme={theme}>
                            <Tooltip title="Home">
                                <IconButton color="primary" onClick={() => {window.location = "/"}}>
                                    <KeyboardBackspaceRoundedIcon
                                        fontSize="medium" 
                                    />
                                </IconButton>
                            </Tooltip>
                        </ThemeProvider>
                        
                        <Box sx={{ width: 200 }}>
                            <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1 }} style={{ alignItems: "center", margin: 0 }}>
                                <VolumeDown />
                                <ThemeProvider theme={theme}>
                                    <Tooltip title="Volume">
                                        <Slider aria-label="Volume" value={this.state.volume} onChange={this.handleChange}/>
                                    </Tooltip>
                                </ThemeProvider>
                                <VolumeUp />
                            </Stack>
                        </Box>

                        <ThemeProvider theme={theme}>
                            <Tooltip title="Retry">
                                <IconButton color="primary" onClick={() => {window.location.reload();}}>
                                    <ReplayRoundedIcon
                                        fontSize="medium" 
                                    />
                                </IconButton>
                            </Tooltip>
                        </ThemeProvider>
                    </div>
                </div>

                <div className="game" style={{width: "50%"}}>
                    <ShowSubtitles
                        state={this.state}
                        ytSongID={this.ytSongID}
                        volume={this.state.volume/100}
                    />
                </div>
            </div>
        );
    }
}

function ShowSubtitles({state, ytSongID}) {
    if (state.errorMsg != null)
        return <p>{state.errorMsg}</p>

    return <LyricsPromptComp
        subtitles={state.subtitles}
        ytSongID={ytSongID}
        volume={state.volume/100}
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
