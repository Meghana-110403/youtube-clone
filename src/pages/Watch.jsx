import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { youtubeAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { getStored, setStored, STORAGE_KEYS } from '../utils/localStore';
import SignInModal from '../components/SignInModal';

const Watch = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [localComments, setLocalComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [reaction, setReaction] = useState(null); // 'like' | 'dislike' | null
    const [subscribed, setSubscribed] = useState(false);
    const [shareCopied, setShareCopied] = useState(false);
    const [showSignIn, setShowSignIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const reactionKey = `yt_clone_reaction_${id}`;
    const commentsKey = `yt_clone_comments_${id}`;
    const channelId = video?.snippet?.channelId;

    const fetchVideoDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [videoData, commentsData] = await Promise.all([
                youtubeAPI.getVideoDetails(id),
                youtubeAPI.getComments(id),
            ]);
            setVideo(videoData);
            setComments(commentsData || []);
        }
        catch (err) {
            setError('Failed to load video. Please try again.');
            console.error('Error:', err);
        }
        finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (!id) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional data fetch when id changes
        fetchVideoDetails();

        const storedReaction = localStorage.getItem(reactionKey);
        
        setReaction(storedReaction || null);

        const storedComments = getStored(commentsKey, []);
        
        setLocalComments(storedComments);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, fetchVideoDetails]);

    // Record this video in watch history once its details have loaded
    useEffect(() => {
        if (!video) return;
        const historyList = getStored(STORAGE_KEYS.HISTORY, []);
        const withoutCurrent = historyList.filter((item) => item.id !== id);
        const updated = [
            { id, snippet: video.snippet, statistics: video.statistics, watchedAt: Date.now() },
            ...withoutCurrent,
        ].slice(0, 50);
        setStored(STORAGE_KEYS.HISTORY, updated);
    }, [video, id]);

    // Check subscribe state once we know the channel
    useEffect(() => {
        if (!channelId) return;
        const subs = getStored(STORAGE_KEYS.SUBSCRIPTIONS, {});
        // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: restore local state once channel is known
        setSubscribed(Boolean(subs[channelId]));
    }, [channelId]);

    const handleReaction = (type) => {
        if (!user) {
            setShowSignIn(true);
            return;
        }
        const newReaction = reaction === type ? null : type;
        setReaction(newReaction);
        if (newReaction) {
            localStorage.setItem(reactionKey, newReaction);
        }
        else {
            localStorage.removeItem(reactionKey);
        }

        // Keep the "Liked videos" page in sync with the current reaction
        const likedMap = getStored(STORAGE_KEYS.LIKED_VIDEOS, {});
        if (newReaction === 'like' && video) {
            likedMap[id] = { id, snippet: video.snippet, statistics: video.statistics };
        }
        else {
            delete likedMap[id];
        }
        setStored(STORAGE_KEYS.LIKED_VIDEOS, likedMap);
    };

    const handleSubscribe = () => {
        if (!user) {
            setShowSignIn(true);
            return;
        }
        if (!channelId) return;

        const subs = getStored(STORAGE_KEYS.SUBSCRIPTIONS, {});
        if (subs[channelId]) {
            delete subs[channelId];
            setSubscribed(false);
        }
        else {
            subs[channelId] = {
                channelId,
                channelTitle: video.snippet.channelTitle,
                subscribedAt: Date.now(),
            };
            setSubscribed(true);
        }
        setStored(STORAGE_KEYS.SUBSCRIPTIONS, subs);
    };

    const handleShare = async () => {
        const shareUrl = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: video?.snippet?.title || 'Check out this video', url: shareUrl });
                return;
            }
            catch {
                // user cancelled the native share sheet, or it's unsupported — fall back to copy
            }
        }
        try {
            await navigator.clipboard.writeText(shareUrl);
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2000);
        }
        catch {
            // clipboard unavailable — nothing more we can do here
        }
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            setShowSignIn(true);
            return;
        }
        if (!commentText.trim()) return;

        const newComment = {
            id: `local-${Date.now()}`,
            isLocal: true,
            snippet: {
                topLevelComment: {
                    snippet: {
                        authorDisplayName: user.name,
                        authorProfileImageUrl: user.avatar,
                        textDisplay: commentText.trim(),
                        likeCount: 0,
                    },
                },
            },
        };

        const updated = [newComment, ...localComments];
        setLocalComments(updated);
        setStored(commentsKey, updated);
        setCommentText('');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading video...</p>
            </div>
        );
    }

    if (error || !video) {
        return (
            <div className="error-container">
                <p>{error || 'Video not found'}</p>
                <Link to="/" className="back-home">Back to Home</Link>
            </div>
        );
    }

    const { snippet, statistics } = video;
    const allComments = [...localComments, ...comments];
    const baseLikes = parseInt(statistics?.likeCount || 0);
    const displayLikes = baseLikes + (reaction === 'like' ? 1 : 0);

    return (
        <div className="watch-page">
            <div className="video-player-wrapper">
                <ReactPlayer
                    src={`https://www.youtube.com/watch?v=${id}`}
                    controls
                    width="100%"
                    height="100%"
                    className="video-player"
                />
            </div>

            <div className="video-details">
                <h2>{snippet?.title || 'Untitled'}</h2>
                <div className="video-stats">
                    <span>{parseInt(statistics?.viewCount || 0).toLocaleString()} views</span>
                    <div className="actions">
                        <button
                            className={`like-btn ${reaction === 'like' ? 'active' : ''}`}
                            onClick={() => handleReaction('like')}
                        >
                            👍 {displayLikes.toLocaleString()}
                        </button>
                        <button
                            className={`dislike-btn ${reaction === 'dislike' ? 'active' : ''}`}
                            onClick={() => handleReaction('dislike')}
                        >
                            👎
                        </button>
                        <button className="share-btn" onClick={handleShare}>
                            {shareCopied ? 'Link copied!' : 'Share'}
                        </button>
                        <button className="save-btn">Save</button>
                    </div>
                </div>
                <div className="channel-info">
                    <div className="channel-details">
                        <div className="channel-avatar-large">
                            <img src="https://via.placeholder.com/48/333/666?text=CH" alt="Channel" />
                        </div>
                        <div>
                            <h3>{snippet?.channelTitle || 'Unknown Channel'}</h3>
                            <p className="subscriber-count">1.2M subscribers</p>
                        </div>
                    </div>
                    <button
                        className={`subscribe-btn ${subscribed ? 'subscribed' : ''}`}
                        onClick={handleSubscribe}
                    >
                        {subscribed ? 'Subscribed' : 'Subscribe'}
                    </button>
                </div>
                <p className="description">{snippet?.description || 'No description available.'}</p>
            </div>

            <div className="comments-section">
                <h3>{allComments.length} Comments</h3>
                <form className="comment-input" onSubmit={handleCommentSubmit}>
                    <img
                        className="comment-input-avatar"
                        src={user ? user.avatar : 'https://via.placeholder.com/40/333/666?text=U'}
                        alt=""
                    />
                    <input
                        type="text"
                        placeholder={user ? 'Add a comment...' : 'Sign in to comment'}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onFocus={() => { if (!user) setShowSignIn(true); }}
                    />
                    <button type="submit">Comment</button>
                </form>
                <div className="comments-list">
                    {allComments.slice(0, 20).map((comment) => (
                        <div key={comment.id} className="comment">
                            <div className="comment-avatar">
                                <img
                                    src={comment.snippet?.topLevelComment?.snippet?.authorProfileImageUrl ||
                                    'https://via.placeholder.com/40/333/666?text=U'}
                                    alt="avatar"
                                />
                            </div>
                            <div className="comment-content">
                                <div className="comment-author">
                                    {comment.snippet?.topLevelComment?.snippet?.authorDisplayName || 'Unknown User'}
                                </div>
                                <p>{comment.snippet?.topLevelComment?.snippet?.textDisplay || ''}</p>
                                <div className="comment-actions">
                                    <button>👍</button>
                                    <span>{comment.snippet?.topLevelComment?.snippet?.likeCount || 0}</span>
                                    <button>Reply</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
        </div>
    );
};

export default Watch;