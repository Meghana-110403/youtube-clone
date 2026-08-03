import { useState } from 'react';
import { VideoContext } from './videoContextInstance';

export const VideoProvider = ({ children }) => {
    const [videos, setVideos] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const value = {
        videos,
        setVideos,
        searchResults,
        setSearchResults,
        loading,
        setLoading,
    };

    return (
        <VideoContext.Provider value={value}>
            {children}
        </VideoContext.Provider>
    );
};