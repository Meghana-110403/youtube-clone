import axios from 'axios';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

if (!API_KEY) {
    console.warn(
        'Missing VITE_YOUTUBE_API_KEY. Create a .env file with VITE_YOUTUBE_API_KEY=your_key.'
    );
}

export const youtubeAPI = {

    getTrending: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/videos`, {
                params: {
                    part: 'snippet,statistics',
                    chart: 'mostPopular',
                    maxResults: 50,
                    key: API_KEY,
                },
            });
            return response.data.items || [];
        }
        catch (error) {
            console.error('Error fetching trending videos:', error);
            return [];
        }
    },

    searchVideos: async (query, order = 'relevance') => {
        try {
            const response = await axios.get(`${BASE_URL}/search`, {
                params: {
                    part: 'snippet',
                    maxResults: 20,
                    q: query,
                    key: API_KEY,
                    type: 'video',
                    order,
                },
            });
            return response.data.items || [];
        }
        catch (error) {
            console.error('Error searching videos:', error);
            return [];
        }
    },

    getVideoDetails: async (videoId) => {
        try {
            const response = await axios.get(`${BASE_URL}/videos`, {
                params: {
                    part: 'snippet,statistics',
                    id: videoId,
                    key: API_KEY,
                },
            });
            return response.data.items?.[0] || null;
        }
        catch (error) {
            console.error('Error getting video details:', error);
            return null;
        }
    },

    getComments: async (videoId) => {
        try {
            const response = await axios.get(`${BASE_URL}/commentThreads`, {
                params: {
                    part: 'snippet',
                    videoId: videoId,
                    maxResults: 20,
                    key: API_KEY,
                },
            });
            return response.data.items || [];
        }
        catch (error) {
            console.error('Error getting comments:', error);
            return [];
        }
    },

    getRelatedVideos: async (videoId) => {
        try {
            const videoResponse = await axios.get(`${BASE_URL}/videos`, {
                params: {
                    part: 'snippet',
                    id: videoId,
                    key: API_KEY,
                },
            });
            const sourceVideo = videoResponse.data.items?.[0];
            if (!sourceVideo) return [];

            const searchTerm =
                sourceVideo.snippet.tags?.slice(0, 3).join(' ') ||
                sourceVideo.snippet.title;

            const searchResponse = await axios.get(`${BASE_URL}/search`, {
                params: {
                    part: 'snippet',
                    maxResults: 20,
                    q: searchTerm,
                    key: API_KEY,
                    type: 'video',
                },
            });

            return (searchResponse.data.items || []).filter(
                (item) => item.id?.videoId !== videoId
            );
        }
        catch (error) {
            console.error('Error getting related videos:', error);
            return [];
        }
    },
};