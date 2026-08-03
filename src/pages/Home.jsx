import { useState, useEffect, useCallback } from 'react';
import VideoCard from '../components/VideoCard';
import { youtubeAPI } from '../utils/api';

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTrendingVideos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await youtubeAPI.getTrending();
            setVideos(data || []);
        }
        catch (err) {
            setError('Failed to load videos. Please try again.');
            console.error('Error fetching videos:', err);
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional data fetch on mount
        fetchTrendingVideos();
    }, [fetchTrendingVideos]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading videos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button onClick={fetchTrendingVideos} className="retry-btn">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="home">
            {videos.length === 0 ?
            (
                <div className="no-videos">
                    <p>No videos available</p>
                </div>
            ) :
            (
                <div className="video-grid">
                    {videos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;