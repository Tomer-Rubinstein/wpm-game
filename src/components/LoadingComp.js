import { CircularProgress } from "@mui/material";

function LoadingComp() {
    return (
        <div style={{position: "relative", textAlign: "center"}}>
            <CircularProgress
                sx={(theme) => ({
                    color: "#F5DEB3"
                })}
                size="5rem"
            />
        </div>
    );
}

export default LoadingComp;

