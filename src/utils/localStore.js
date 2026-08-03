// Centralized localStorage helpers, used for all the "local/mock" data this
// clone persists in the browser: liked videos, watch history, subscriptions.
// Nothing here talks to any server — it's all client-side only.

export const STORAGE_KEYS = {
    LIKED_VIDEOS: 'yt_clone_liked_videos',
    HISTORY: 'yt_clone_history',
    SUBSCRIPTIONS: 'yt_clone_subscriptions',
};

export const getStored = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    }
    catch {
        return fallback;
    }
};

export const setStored = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch {
        // localStorage unavailable (private browsing, storage full, etc.) — ignore
    }
};