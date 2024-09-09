import { Button } from "@mui/material";
import "./GameSummary.css";
import BackHomeButton from "../components/BackHomeButton";

const LOSE_GIF_URL = "https://c.tenor.com/weB7SDBJ1lgAAAAC/tenor.gif";
const WIN_GIF_URL = "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3EzeGprYzE4NGYzMnR5cDBlMnExemdpd2hpcXV3cTA1bGhsbjd0YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKtoqVI4jpcgsUw/giphy.webp";

export default function GameSummary({isWin, accuracyPercentage}) {
    const headerText = isWin ? "You Won! 🥳" : "You Lost 😭"

    const tryAgain = () => {
        window.location.reload();
    }

    return (
        <div className="parent">
            <h1 style={{marginTop: "2vh"}}>{headerText}</h1>

            <img
                className="gifDiv"
                src={isWin ? WIN_GIF_URL : LOSE_GIF_URL}
                alt="GIF"
                style={{display: "inline-block"}}
            />

            <div className="accuracyDiv">
                <h2>{accuracyPercentage}<span style={{fontSize: "2rem"}}>%</span></h2>
                <p>Accuracy</p>
            </div>

            <BackHomeButton/>

            <Button
                style={{marginTop: "5vh", margin: "10px"}}
                size="large"
                variant="text"
                onClick={tryAgain}
            >TRY AGAIN</Button>
        </div>
    );
}
