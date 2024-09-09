import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { Button } from "@mui/material";


export default function BackHomeButton() {
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
