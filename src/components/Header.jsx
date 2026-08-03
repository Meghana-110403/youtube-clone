import { useState } from 'react';
import { FaYoutube, FaSearch, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SignInModal from './SignInModal';

const Header = ({ onSearch, toggleSidebar }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showSignIn, setShowSignIn] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            if (onSearch) onSearch(searchQuery);
        }
    };

    const handleSignOut = () => {
        signOut();
        setShowMenu(false);
    };

    return (
        <header className="header">
            <div className="header-left">
                <button className="menu-btn" onClick={toggleSidebar}>
                    <FaBars />
                </button>
                <div className="logo" onClick={() => navigate('/')}>
                    <FaYoutube className="youtube-icon" />
                    <span>YouTube</span>
                </div>
            </div>

            <form onSubmit={handleSearch} className="search-bar">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">
                    <FaSearch />
                </button>
            </form>

            <div className="auth-buttons">
                {user ? (
                    <div className="user-menu">
                        <button className="user-avatar-btn" onClick={() => setShowMenu(!showMenu)}>
                            <img src={user.avatar} alt={user.name} />
                        </button>
                        {showMenu && (
                            <>
                                <div className="menu-overlay" onClick={() => setShowMenu(false)} />
                                <div className="user-dropdown">
                                    <div className="user-dropdown-name">{user.name}</div>
                                    <button onClick={handleSignOut}>Sign out</button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <button className="sign-in" onClick={() => setShowSignIn(true)}>
                        Sign In
                    </button>
                )}
            </div>

            {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
        </header>
    );
};

export default Header;