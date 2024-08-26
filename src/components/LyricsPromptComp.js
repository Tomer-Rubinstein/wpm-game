import React from "react";
import "./LyricsPromptComp.css";
import FirstLine from './FirstLine';
import ReactPlayer from 'react-player/youtube'
import Interval from "../utils/Interval";

class LyricsPromptComp extends React.Component {
    constructor(props) {
        super(props);

        this.subtitles = this.props.subtitles;
        this.ytSongID = this.props.ytSongID;

        const startTimeDelta = 5;
        [this.timingList, this.fixedStartTime] = this.initTimingList(this.subtitles, startTimeDelta);

        this.linesToDisplay = 5;
        this.startedCounting = false;
        this.tickInterval = new Interval(this.gameTick, this.timingList[0]*1000);

        this.state = {
            currLineIndex: -1,
            currCharIndex: 0,
            successfulTypes: [], // true, false, true, true, ...
            isPlaying: false
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

    setNewTime = (newTime) => {
        this.tickInterval.stop();
        this.tickInterval = new Interval(this.gameTick, newTime);
        if (!this.tickInterval.isRunning() && this.state.isPlaying)
            this.tickInterval.start();
    }

    gameTick = () => {
        var currLineIndex = this.state.currLineIndex;
        var currCharIndex = this.state.currCharIndex;
        var successfulTypes = this.state.successfulTypes;

        currLineIndex++;
        currCharIndex = 0;
        successfulTypes = [];

        const deltaTime = (this.timingList[currLineIndex+1] - this.timingList[currLineIndex]); // TODO: bounds check
        this.setNewTime(deltaTime*1000);

        this.setState({
            currLineIndex: currLineIndex,
            currCharIndex: currCharIndex,
            successfulTypes: successfulTypes
        });
    }
    
    startGame = () => {
        this.setState({isPlaying: true})
    }

    // TODO: special characters (, . ? ! : ; ( ) )
    onkeydown = (event) => {
        if (this.state.currLineIndex < 0 || this.state.currLineIndex >= this.subtitles.length)
            return;

        var currLineIndex = this.state.currLineIndex;
        var currCharIndex = this.state.currCharIndex;
        var successfulTypes = this.state.successfulTypes;

        if (this.state.isPlaying && this.handleSpecialKeys(event.keyCode))
            return;

        const currLine = this.subtitles[currLineIndex]['text'];
        const pressedChar = event.key.toLowerCase();
        const targetChar = currLine.charAt(currCharIndex).toLowerCase();

        successfulTypes.push(pressedChar === targetChar);
        currCharIndex++;
        
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
            isPlaying: isPlaying
        });
        return true;
    }

    render() {
        if (!this.tickInterval.isRunning() && this.state.isPlaying)
            this.tickInterval.start();

        const lineIndexToDisplay = (this.state.currLineIndex < 0) ? 0 : this.state.currLineIndex;
        const currLines = this.subtitles.slice(
            lineIndexToDisplay,
            lineIndexToDisplay+this.linesToDisplay
        );

        if (currLines === undefined) { /* TODO: win condition */ }
        
        const subtitles = currLines.map((subtitle, i) => {
            const text = subtitle['text'];
            
            if (i === 0)
                return <li key={i}>
                    <FirstLine
                        text={text}
                        successfulTypes={this.state.successfulTypes}
                        currCharIndex={this.state.currCharIndex}
                    />
                </li>

            return <li key={i}>{text}</li>
        });

        return <div className="promptParentDiv" onClick={this.startGame}>
            <p className="clickToPlay">{this.state.isPlaying ? "" : "Click to Play"}</p>
            <ul className={this.state.isPlaying ? "" : "blury"}>{subtitles}</ul>
            <InvisibleReactPlayer
                timeToStart={this.fixedStartTime}
                isPlaying={this.state.isPlaying}
                ytSongID={this.ytSongID}
            />
        </div>
    }
}

function InvisibleReactPlayer({timeToStart, isPlaying, ytSongID}) {
    const playerRef = React.useRef();
    
    const onReady = React.useCallback(() => {
        playerRef.current.seekTo(timeToStart, "seconds");
    }, [timeToStart]);

    return (
        <ReactPlayer
            url={`https://www.youtube.com/watch?v=${ytSongID}`}
            volume={.1}
            width="0px"
            height="0px"
            playing={isPlaying}
            ref={playerRef}
            onReady={onReady}
        />
    );
}

export default LyricsPromptComp;
