import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
    if (!video || !video.snippet) {
        return null;
    }

    const videoId = video.id?.videoId || video.id || '';
    const { snippet, statistics } = video;

    const formatViews = (views) => {
        if (!views) return '0 views';
        const num = parseInt(views);
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`;
        return `${num} views`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getThumbnail = () => {
        if (snippet.thumbnails?.maxres) return snippet.thumbnails.maxres.url;
        if (snippet.thumbnails?.high) return snippet.thumbnails.high.url;
        if (snippet.thumbnails?.medium) return snippet.thumbnails.medium.url;
        if (snippet.thumbnails?.default) return snippet.thumbnails.default.url;
        return 'https://via.placeholder.com/320x180/333/666?text=No+Image';
    };

    return (
        <div className="video-card">
            <Link to={`/watch/${videoId}`}>
                <div className="thumbnail">
                    <img
                        src={getThumbnail()}
                        alt={snippet.title || 'Video thumbnail'}
                        loading="lazy"
                    />
                </div>
                <div className="video-info">
                    <div className="channel-avatar">
                        <img 
                        src="https://via.placeholder.com/36/333/666?text=CH" 
                        alt="Channel"
                        />
                    </div>
                    <div className="video-details">
                        <h3>{snippet.title || 'Untitled Video'}</h3>
                        <p className="channel-name">{snippet.channelTitle || 'Unknown Channel'}</p>
                        <div className="video-meta">
                            <span>{formatViews(statistics?.viewCount)}</span>
                            {snippet.publishedAt && (
                                <>
                                    <span>•</span>
                                    <span>{formatDate(snippet.publishedAt)}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default VideoCard;