import { useState, useEffect, useCallback } from 'react';
import { youtubeAPI } from '../utils/api';

export const useYoutubeAPI = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get trending videos
    const getTrendingVideos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await youtubeAPI.getTrending();
            setVideos(data);
            return data;
        }
        catch (err) {
            setError(err.message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, []);

    // Search videos. `order` can be 'relevance' | 'date' | 'viewCount' | 'rating' | 'title'
    const searchVideos = useCallback(async (query, order = 'relevance') => {
        setLoading(true);
        setError(null);
        try {
            const data = await youtubeAPI.searchVideos(query, order);
            setVideos(data);
            return data;
        }
        catch (err) {
            setError(err.message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, []);

    // Get video details
    const getVideoDetails = useCallback(async (videoId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await youtubeAPI.getVideoDetails(videoId);
            return data;
        }
        catch (err) {
            setError(err.message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, []);

    // Get video comments
    const getVideoComments = useCallback(async (videoId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await youtubeAPI.getComments(videoId);
            return data;
        }
        catch (err) {
            setError(err.message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, []);

    // Get related videos — keyed off the given videoId
    const getRelatedVideos = useCallback(async (videoId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await youtubeAPI.getRelatedVideos(videoId);
            return data;
        }
        catch (err) {
            setError(err.message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, []);

    return {
        videos,
        loading,
        error,
        getTrendingVideos,
        searchVideos,
        getVideoDetails,
        getVideoComments,
        getRelatedVideos,
        setVideos,
    };
};

// Specific hook for video player
export const useVideoPlayer = (videoId) => {
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getVideoDetails, getVideoComments, getRelatedVideos } = useYoutubeAPI();

    const fetchVideoData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [videoData, commentsData, relatedData] = await Promise.all([
                getVideoDetails(videoId),
                getVideoComments(videoId),
                getRelatedVideos(videoId),
            ]);
            setVideo(videoData);
            setComments(commentsData);
            setRelatedVideos(relatedData);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }, [videoId, getVideoDetails, getVideoComments, getRelatedVideos]);

    useEffect(() => {
        if (videoId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional data fetch when videoId changes
            fetchVideoData();
        }
    }, [videoId, fetchVideoData]);

    return { video, comments, relatedVideos, loading, error, refetch: fetchVideoData };
};

// Hook for infinite scroll
export const useInfiniteScroll = (fetchMore) => {
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop
                >= document.documentElement.scrollHeight - 500) {
                setIsFetching(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!isFetching) return;
        fetchMore().finally(() => setIsFetching(false));
    }, [isFetching, fetchMore]);

    return { isFetching };
};