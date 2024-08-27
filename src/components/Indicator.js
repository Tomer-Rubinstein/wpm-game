
export default function Indicator({syncLineIndex, currLineIndex}) {
    const difference = syncLineIndex-currLineIndex;
    if (difference < 0 || difference > 2)
        return <></>
    
    const diffColors = ["#77dd77", "#ffbf00", "#cf352e"];
    return (
        <p className={(difference === 2) ? "warningIndicator" : ""} style={{
            display: "inline",
            fontWeight: "bold",
            color: diffColors[difference],
        }}>&rarr; </p>
    );
}
