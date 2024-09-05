import './Home.css';
import React from 'react';
import { TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import RecommendationCard from '../components/RecommendationCard';
import Grid from '@mui/material/Grid';
import { useNavigate } from "react-router-dom";

export default function Home () {
    const navigate = useNavigate();

    const theme = createTheme({
        palette: {
            primary: {
                main: "#FFFFFF",
            },
        }
    });

    const quickPlays = [
            {
                songUrl: "https://www.youtube.com/watch?v=eVli-tstM5E",
                songTitle: "Sabrina Carpenter - Espresso"
            },
            {
                songUrl: "https://www.youtube.com/watch?v=CfihYWRWRTQ",
                songTitle: "John Newman - Love Me Again"
            },
            {
                songUrl: "https://www.youtube.com/watch?v=hT_nvWreIhg",
                songTitle: "OneRepublic - Counting Stars"
            },
    ];

    const playGameByUrl = (event) => {
        if (event.key === "Enter") {
            const youtubeUrl = event.target.value;
            event.preventDefault();
            navigate(`/game?ytSongID=${youtubeUrl}`);
        }
    }

    return (
        <div className="background">
            <div>
                <h1 style={{color: "wheat"}}>KaraokeTyper</h1>
                <p>Choose a song from YouTube and type it's lyrics in sync. Try your best! 😝</p>
            </div>
            <div style={{width: "50%", paddingTop: "5%"}}>
                <ThemeProvider theme={theme}>
                    <TextField
                        id="outlined-required"
                        label="YouTube URL goes here..."
                        variant="filled"
                        color="primary"
                        fullWidth
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                color: "#2e2e2e",
                            },
                            input: {color: "wheat"},
                        }}
                        inputProps={{min: 0, style: { textAlign: 'center' }}}
                        onKeyDown={playGameByUrl}
                    />
                </ThemeProvider>
            </div>

            <div style={{width: "100%", paddingTop: "3%", textAlign: "center"}}>
                <h2 style={{color: "wheat"}}>Quick Plays 💨</h2>

                <Grid container justifyContent="center" spacing={20} paddingTop="1%">
                    {quickPlays.map((play, index) => (
                        <Grid key={index} item>
                            <RecommendationCard
                                songUrl={play['songUrl']}
                                songTitle={play['songTitle']}
                            />
                        </Grid>
                    ))}
                </Grid>
            </div>
        </div>
    );
}
