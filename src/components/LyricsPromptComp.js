import React from "react";
import "./LyricsPromptComp.css";
import FirstLine from './FirstLine';
import { DynamicInterval } from "../utils/Interval";
import InvisibleReactPlayer from "./InvisibleReactPlayer";
import Indicator from "./Indicator";
import { setAccuracy, setIsWin } from "../utils/GameStateSlice";
import { connect } from "react-redux";

class LyricsPromptComp extends React.Component {
    constructor(props) {
        super(props);

        // this.gameStateSlice = useSelector(state => state.gameStateSlice);
        // this.gameStateDispatch = useDispatch();

        this.noOfTypes = 0;
        this.noOfCorrectTypes = 0;

        this.subtitles = this.props.subtitles;
        this.ytSongID = this.props.ytSongID;

        const startTimeDelta = 1; // debug, TODO: in production set to 5 
        [this.timingList, this.fixedStartTime] = this.initTimingList(this.subtitles, startTimeDelta);

        this.linesToDisplay = 5;
        this.startedCounting = false;
        this.tickInterval = new DynamicInterval(this.gameTick, this.timingList[0]*1000);

        this.state = {
            currLineIndex: -1,
            syncLineIndex: -1,
            currCharIndex: 0,
            successfulTypes: [], // true, false, true, true, ...
            isPlaying: false,
        };

        onkeydown = this.onkeydown;
    }

    /* initialize the lyrics timing such that the first lyric line
    * will activate after @startTimeDelta seconds after user started game.
    * returns the fixated timingList and the constant that was used for the fix 
    * the fix constant will be used to start the ReactPlayer accordingly */
    initTimingList = (subtitles, startTimeDelta) => {
        var fix = 0;
        const timingList = subtitles.map((subtitle, i) => {
            var startTime = subtitle['startTime'];
            if (i === 0)
                fix = Math.max(0, startTime-startTimeDelta);

            return startTime-fix;
        });

        return [timingList, fix];
    }

    gameTick = () => {
        if (!this.state.isPlaying)
            return;

        var currLineIndex = this.state.currLineIndex;
        var currCharIndex = this.state.currCharIndex;
        var successfulTypes = this.state.successfulTypes;
        var syncLineIndex = this.state.syncLineIndex;
        const { dispatch } = this.props;

        syncLineIndex++;
        if (currLineIndex < 0)
            currLineIndex++;

        const currLine = this.subtitles[currLineIndex]['text'];
        if (currCharIndex >= currLine.length && this.state.syncLineIndex === this.state.currLineIndex) {
            currLineIndex++;
            currCharIndex = 0;
            successfulTypes = [];
        }

        const accuracy = Math.floor((this.noOfCorrectTypes/this.noOfTypes)*100);
        // check win condition
        if (currLineIndex >= this.subtitles.length) {
            dispatch(setAccuracy(accuracy));
            dispatch(setIsWin(true));
            this.tickInterval.tickInterval.stop();
            return;
        }

        // check lose condition
        const NO_OF_LINES_FOR_LOSE = 1; // debug, TODO: in production set to 3.
        if (syncLineIndex-currLineIndex >= NO_OF_LINES_FOR_LOSE) {
            dispatch(setAccuracy(accuracy));
            dispatch(setIsWin(false));
            this.tickInterval.tickInterval.stop();
            return;
        }

        const deltaTime = (this.timingList[syncLineIndex+1] - this.timingList[syncLineIndex]); // TODO: bounds check
        this.tickInterval.setNewTime(deltaTime*1000);

        this.setState({
            syncLineIndex: syncLineIndex,
            currLineIndex: currLineIndex,
            currCharIndex: currCharIndex,
            successfulTypes: successfulTypes
        });
    }
    
    startGame = () => {
        this.setState({isPlaying: true})
    }

    onkeydown = (event) => {
        if (this.state.currLineIndex < 0 || this.state.currLineIndex >= this.subtitles.length)
            return;

        var currLineIndex = this.state.currLineIndex;
        var currCharIndex = this.state.currCharIndex;
        var successfulTypes = this.state.successfulTypes;

        if (this.state.isPlaying && this.handleSpecialKeys(event.keyCode))
            return;

        this.noOfTypes++;

        const currLine = this.subtitles[currLineIndex]['text'];
        const pressedChar = event.key.toLowerCase();
        const targetChar = currLine.charAt(currCharIndex).toLowerCase();

        const isCharTypedCorrectly = (pressedChar === targetChar);
        if (isCharTypedCorrectly)
            this.noOfCorrectTypes++;

        successfulTypes.push(isCharTypedCorrectly);
        currCharIndex++;

        if (currCharIndex >= currLine.length && this.state.syncLineIndex > this.state.currLineIndex) {
            currLineIndex++;
            currCharIndex = 0;
            successfulTypes = [];
        }

        this.setState({
            currCharIndex: currCharIndex,
            currLineIndex: currLineIndex,
            successfulTypes: successfulTypes
        });
    }

    handleSpecialKeys = (keyCode) => {
        var currLineIndex = this.state.currLineIndex;
        var currCharIndex = this.state.currCharIndex;
        var successfulTypes = this.state.successfulTypes;
        var isPlaying = this.state.isPlaying;
        var syncLineIndex = this.state.syncLineIndex;
        const currLine = this.subtitles[currLineIndex]['text'];

        switch (keyCode) {
            // escape - pause game
            case 27:
                isPlaying = false;
                console.log("[TODO] pause");
                break;

            // backspace - delete last typed char
            case 8:
                successfulTypes.pop();
                currCharIndex = (currCharIndex-1 < 0) ? 0 : currCharIndex-1;
                break;

            // space bar - can skip word if first letter attempt was made
            case 32:
                if (currCharIndex-1 >= 0 && currLine.charAt(currCharIndex-1) !== ' ') {
                    while(currCharIndex < currLine.length) {
                        successfulTypes.push(false);
                        currCharIndex++;

                        if (currLine.charAt(currCharIndex-1) === ' ')
                            break;
                    }
                }
                break;

            default: return false;
        }

        this.setState({
            currCharIndex: currCharIndex,
            currLineIndex: currLineIndex,
            successfulTypes: successfulTypes,
            isPlaying: isPlaying,
            syncLineIndex: syncLineIndex
        });
        return true;
    }

    render() {
        if (this.state.isPlaying)
            this.tickInterval.start();

        const lineIndexToDisplay = (this.state.currLineIndex < 0) ? 0 : this.state.currLineIndex;
        const currLines = this.subtitles.slice(
            lineIndexToDisplay,
            lineIndexToDisplay+this.linesToDisplay
        );

        const subtitles = currLines.map((subtitle, i) => {
            const text = subtitle['text'];
            var element = <li>{text}</li>;

            if (i === 0)
                element = <li>
                    <FirstLine
                        text={text}
                        successfulTypes={this.state.successfulTypes}
                        currCharIndex={this.state.currCharIndex}
                    />
                </li>
    
            if (i === this.state.syncLineIndex-this.state.currLineIndex)
                return (
                    <div key={i} style={{display: "inline-block"}}>
                        <Indicator syncLineIndex={this.state.syncLineIndex} currLineIndex={this.state.currLineIndex}/>
                        <div style={{display: "inline-block"}}>{element}</div>
                    </div>
                );
    
            return <div key={i}>{element}</div>;
        });

        return (
            <div className="promptParentDiv" onClick={this.startGame}>
                <p className="clickToPlay">{this.state.isPlaying ? "" : "Click to Play"}</p>
                <ul className={this.state.isPlaying ? "" : "blury"}>{subtitles}</ul>
                <InvisibleReactPlayer
                    timeToStart={this.fixedStartTime}
                    isPlaying={this.state.isPlaying}
                    ytSongID={this.ytSongID}
                />
            </div>
        );
    }
}

export default connect()(LyricsPromptComp);
