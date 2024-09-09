import "./SubtitlesErrorPage.css";
import BackHomeButton from "../components/BackHomeButton";

export default function SubtitlesErrorPage({errorMsg}) {
    return (
        <div className="parentErrorPage">
            <h1>{errorMsg}</h1>
            <BackHomeButton/>
        </div>
    );
}
