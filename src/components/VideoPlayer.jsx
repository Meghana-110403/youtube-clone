import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import {
    FaPlay,
    FaPause,
    FaVolumeUp,
    FaVolumeMute,
    FaExpand,
    FaCompress,
    FaForward,
    FaBackward
} from 'react-icons/fa';

const VideoPlayer = ({ videoUrl, onPlay, onPause, onProgress }) => {
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [muted, setMuted] = useState(false);
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const playerRef = useRef(null);
    const containerRef = useRef(null);

    const handlePlayPause = () => {
        setPlaying(!playing);
        if (playing) {
            onPause?.();
        } else {
            onPlay?.();
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setMuted(newVolume === 0);
    };

    const handleToggleMute = () => {
        setMuted(!muted);
    };

    const handleProgress = (state) => {
        setPlayed(state.played);
        onProgress?.(state);
    };

    const handleDuration = (duration) => {
        setDuration(duration);
    };

    const handleSeek = (e) => {
        const seekTime = parseFloat(e.target.value);
        playerRef.current.seekTo(seekTime);
        setPlayed(seekTime);
    };

    const handleSkip = (seconds) => {
        const currentTime = playerRef.current.getCurrentTime();
        playerRef.current.seekTo(currentTime + seconds);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
        } else {
        document.exitFullscreen();
        setIsFullscreen(false);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="video-player-container" ref={containerRef}>
            <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                playing={playing}
                volume={volume}
                muted={muted}
                onProgress={handleProgress}
                onDuration={handleDuration}
                width="100%"
                height="100%"
                config={{
                    youtube: {
                        playerVars: {
                            modestbranding: 1,
                            rel: 0,
                            showinfo: 0,
                        },
                    },
                }}
            />

            <div className="video-controls">
                <div className="progress-bar">
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step="any"
                        value={played}
                        onChange={handleSeek}
                        className="progress-slider"
                        style={{
                            background: `linear-gradient(to right, #ff0000 ${played * 100}%, #555 ${played * 100}%)`,
                        }}
                    />
                    <div className="time-display">
                        <span>{formatTime(played * duration)}</span>
                        <span>/</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="control-buttons">
                    <div className="left-controls">
                        <button onClick={handlePlayPause} className="control-btn">
                            {playing ? <FaPause /> : <FaPlay />}
                        </button>

                        <button onClick={() => handleSkip(-10)} className="control-btn">
                            <FaBackward />
                        </button>

                        <button onClick={() => handleSkip(10)} className="control-btn">
                            <FaForward />
                        </button>

                        <div className="volume-control">
                            <button onClick={handleToggleMute} className="control-btn">
                                {muted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                            </button>
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step="any"
                                value={muted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="volume-slider"
                            />
                        </div>
                    </div>

                    <div className="right-controls">
                        <button onClick={toggleFullscreen} className="control-btn">
                            {isFullscreen ? <FaCompress /> : <FaExpand />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;