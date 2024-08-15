
function FirstLine({text, successfulTypes, currCharIndex}) {
    var words = [];

    for (var i=0; i < text.length; i++) {
        const char = text.charAt(i);
        
        var charToDisplay;
        if (i < successfulTypes.length) {
            // display wrong/correct char types
            const isCharTypedCorrect = successfulTypes[i];

            charToDisplay = <p
                key={i}
                className={isCharTypedCorrect ? "correctChar" : "wrongChar"}
                style={{display: "inline"}}
            >{char}</p>
        } else if (i === currCharIndex) {
            // display a caret before current char to type
            charToDisplay = <div key={i} style={{display: "inline"}}>
                <div className="caret"/>
                <p
                    style={{display: "inline"}}
                >{char}</p>
            </div>
        } else {
            // display the rest of the line
            charToDisplay = <p
                key={i}
                style={{display: "inline"}}
            >{char}</p>
        }

        words.push(charToDisplay);
    }

    return words;
}

export default FirstLine;
