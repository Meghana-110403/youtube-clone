import { useState } from 'react';
import VideoCard from '../components/VideoCard';
import { getStored, setStored, STORAGE_KEYS } from '../utils/localStore';

const History = () => {
    const [videos, setVideos] = useState(() => getStored(STORAGE_KEYS.HISTORY, []));

    const clearHistory = () => {
        setStored(STORAGE_KEYS.HISTORY, []);
        setVideos([]);
    };

    return (
        <div className="home">
            <div className="page-header-row">
                <h2 className="page-title">Watch history</h2>
                {videos.length > 0 && (
                    <button className="clear-history-btn" onClick={clearHistory}>
                        Clear all history
                    </button>
                )}
            </div>
            {videos.length === 0 ? (
                <div className="no-videos">
                    <p>Videos you watch will show up here.</p>
                </div>
            ) : (
                <div className="video-grid">
                    {videos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;