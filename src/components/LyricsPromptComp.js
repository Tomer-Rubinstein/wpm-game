import React from "react";
import FirstLine from './FirstLine';

class LyricsPromptComp extends React.Component {
    constructor(props) {
        super(props);
        this.subtitles = this.props.subtitles;
        this.timingList = [14.28, 17.88, 21.88, 25.44, 29.56, 33.4, 37, 40.72, 50, 55.2];

        this.state = {
            currLineIndex: -1,
            currCharIndex: 0,
            successfulTypes: [] // true, false, true, true, ...
        };

        this.linesToDisplay = 5;
        this.startedCounting = false;
        this.tickInterval = new Interval(this.gameTick, this.timingList[0]*1000);

        onkeydown = this.onkeydown;
    }

    setNewTime = (newTime) => {
        this.tickInterval.stop();
        this.tickInterval = new Interval(this.gameTick, newTime);
        if (!this.tickInterval.isRunning() && this.props.isPlaying)
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

    onkeydown = (event) => {
        if (this.state.currLineIndex < 0)
            return;

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

        const lineIndexToDisplay = (this.state.currLineIndex < 0) ? 0 : this.state.currLineIndex;
        const currLines = this.subtitles.slice(
            lineIndexToDisplay,
            lineIndexToDisplay+this.linesToDisplay
        );

        if (currLines === undefined) { /* TODO */ }
        
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
    this.start = () => {
        if (!this.isRunning())
            timer = setInterval(fn, time);
    };
    this.stop = () => {
        clearInterval(timer);
        timer = false;
    };
    this.isRunning = () => {
        return timer !== false;
    };
    
}

export default LyricsPromptComp;
