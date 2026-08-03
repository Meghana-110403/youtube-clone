import { useState } from 'react';
import VideoCard from '../components/VideoCard';
import { getStored, STORAGE_KEYS } from '../utils/localStore';

const Liked = () => {
    const [videos] = useState(() => Object.values(getStored(STORAGE_KEYS.LIKED_VIDEOS, {})));

    return (
        <div className="home">
            <h2 className="page-title">Liked videos</h2>
            {videos.length === 0 ? (
                <div className="no-videos">
                    <p>Videos you like will show up here.</p>
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

export default Liked;