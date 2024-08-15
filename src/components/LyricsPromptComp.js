import React from "react";
import FirstLine from './FirstLine';

class LyricsPromptComp extends React.Component {
    constructor(props) {
        super(props);
        this.subtitles = this.props.subtitles;

        this.state = {
            currLineIndex: 0,
            currCharIndex: 0,
            successfulTypes: [] // true, false, true, true, ...
        };

        this.linesToDisplay = 5;

        this.secondsPassed = 0;
        this.startedCounting = false;
        this.tickInterval = new Interval(this.gameTick, 500); // TODO: instead of interval, use Date. more accurate.

        onkeydown = this.onkeydown;
    }

    gameTick = () => {
        var currLineIndex = this.state.currLineIndex;
        var currCharIndex = this.state.currCharIndex;
        var successfulTypes = this.state.successfulTypes;
        const currLine = this.subtitles[currLineIndex]['text'];

        this.secondsPassed += 0.5;
        
        console.log(this.secondsPassed);

        if (currCharIndex >= currLine.length) {
            if (parseFloat(this.subtitles[currLineIndex+1]['startTime']) < this.secondsPassed) {
                currLineIndex++;
                currCharIndex = 0;
                successfulTypes = [];
                console.log("can go")
            }
        }

        this.setState({
            currLineIndex: currLineIndex,
            currCharIndex: currCharIndex,
            successfulTypes: successfulTypes
        });
    }

    onkeydown = (event) => {
        var currLineIndex = this.state.currLineIndex;
        var currCharIndex = this.state.currCharIndex;
        var successfulTypes = this.state.successfulTypes;

        // TODO: special characters (, . ? ! : ; ( ) )
        // TODO: backspace, to fix spelling mistakes and other shortcuts

        const currLine = this.subtitles[currLineIndex]['text'];

        const pressedChar = event.key.toLowerCase();
        const targetChar = currLine.charAt(currCharIndex).toLowerCase();

        this.state.successfulTypes.push(pressedChar === targetChar||1==1);

        currCharIndex++;
        
        this.setState({
            currCharIndex: currCharIndex,
            currLineIndex: currLineIndex,
            successfulTypes: successfulTypes
        });
    }

    render() {
        if (!this.tickInterval.isRunning() && this.props.isPlaying)
            this.tickInterval.start();

        const currLines = this.subtitles.slice(
            this.state.currLineIndex,
            this.state.currLineIndex+this.linesToDisplay
        );

        if (currLines === undefined) {

        }
        
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

        return <ul style={{color: "rgba(255, 255, 255, 0.5)", fontWeight: "bold"}}>{subtitles}</ul>
    }
}

function Interval(fn, time) {
    var timer = false;
    this.start = function () {
        if (!this.isRunning())
            timer = setInterval(fn, time);
    };
    this.stop = function () {
        clearInterval(timer);
        timer = false;
    };
    this.isRunning = function () {
        return timer !== false;
    };
}

export default LyricsPromptComp;
