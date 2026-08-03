import { useState, useEffect } from 'react';
import { AuthContext } from './authContextInstance';

const STORAGE_KEY = 'yt_clone_user';

// This is a MOCK, local-only auth system. There is no real backend or OAuth —
// "signing in" just stores a display name in localStorage so likes/comments
// have someone to attribute themselves to. It does not create any real
// account and has no connection to actual YouTube accounts.
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        }
        catch {
            return null;
        }
    });

    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            }
            else {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        catch {
            // localStorage unavailable (private browsing, etc.) — fail silently
        }
    }, [user]);

    const signIn = (name) => {
        const displayName = name?.trim() || 'You';
        setUser({
            name: displayName,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=065fd4&color=fff`,
        });
    };

    const signOut = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};