import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { youtubeAPI } from '../utils/api';
import { FaFilter } from 'react-icons/fa';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('relevance');
    const [showFilters, setShowFilters] = useState(false);

    const performSearch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const results = await youtubeAPI.searchVideos(query, filter);
            setVideos(results || []);
        }
        catch (err) {
            setError('Failed to search videos. Please try again.');
            console.error('Search error:', err);
        }
        finally {
            setLoading(false);
        }
    }, [query, filter]);

    useEffect(() => {
        if (query) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional data fetch when query/filter changes
            performSearch();
        }
    }, [query, filter, performSearch]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Searching for "{query}"...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button onClick={performSearch} className="retry-btn">Try Again</button>
            </div>
        );
    }

    return (
        <div className="search-page">
            <div className="search-header">
                <h2>
                    {query ? `Results for "${query}"` : 'Search YouTube'}
                </h2>
                <div className="search-actions">
                    <button
                        className="filter-toggle"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FaFilter /> Filters
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="filter-panel">
                    <div className="filter-group">
                        <label>Sort By</label>
                        <div className="filter-options">
                            {['relevance', 'date', 'viewCount'].map((option) => (
                                <button
                                    key={option}
                                    className={`filter-option ${filter === option ? 'active' : ''}`}
                                    onClick={() => setFilter(option)}
                                >
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {videos.length === 0 && !loading && query && (
                <div className="no-results">
                    <p>No results found for "{query}"</p>
                    <p className="suggestion">Try different keywords or check your spelling</p>
                </div>
            )}

            <div className="search-results">
                {videos.map((video, index) => (
                    <div key={video.id?.videoId || video.id || index} className="search-result-item">
                        <VideoCard video={video} />
                    </div>
                ))}
            </div>

            {videos.length > 0 && (
                <div className="search-stats">
                    <p>{videos.length} results found</p>
                </div>
            )}
        </div>
    );
};

export default Search;