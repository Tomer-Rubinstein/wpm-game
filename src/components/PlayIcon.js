import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function PlayIcon({subtext}) {
    const theme = createTheme({
        palette: {
            primary: {
                main: "#FFFFFF",
            },
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <PlayArrowRoundedIcon color="primary" fontSize="large"/>
        </ThemeProvider>
    );
}
