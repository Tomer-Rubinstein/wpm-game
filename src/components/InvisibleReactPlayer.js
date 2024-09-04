import ReactPlayer from 'react-player/youtube'
import React from 'react';

export default function InvisibleReactPlayer({timeToStart, isPlaying, ytSongID, volume}) {
    const playerRef = React.useRef();
    
    console.log(volume);

    const onReady = React.useCallback(() => {
        playerRef.current.seekTo(timeToStart, "seconds");
    }, [timeToStart]);

    return (
        <ReactPlayer
            url={`https://www.youtube.com/watch?v=${ytSongID}`}
            volume={volume}
            width="0px"
            height="0px"
            playing={isPlaying}
            ref={playerRef}
            onReady={onReady}
        />
    );
}
