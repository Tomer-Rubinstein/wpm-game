import { Button } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import "./GameSummary.css";
import { useNavigate } from "react-router-dom";

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

function BackHomeButton() {
    const navigate = useNavigate();

    const theme = createTheme({
        palette: {
            primary: {
                main: "#FFFFFF",
            },
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <Button
                startIcon={<HomeRoundedIcon fontSize="small"/>}
                style={{marginTop: "5vh", justifyContent: "center"}}
                size="large"
                variant="outlined"
                onClick={() => navigate("/")}
            >HOME</Button>
        </ThemeProvider>
    );
}
