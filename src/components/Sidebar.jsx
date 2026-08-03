import {
    FaHome,
    FaFire,
    FaSubscript,
    FaFolder,
    FaHistory,
    FaClock,
    FaThumbsUp,
    FaYoutube,
    FaFilm,
    FaGamepad,
    FaNewspaper,
    FaMusic,
    FaTshirt,
    FaCog,
    FaFlag,
    FaQuestionCircle,
    FaLightbulb
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const mainMenu = [
        { icon: FaHome, label: 'Home', path: '/' },
        { icon: FaFire, label: 'Trending', path: '/trending' },
        { icon: FaSubscript, label: 'Subscriptions', path: '/subscriptions' },
    ];

    const library = [
        { icon: FaFolder, label: 'Library', path: '/library' },
        { icon: FaHistory, label: 'History', path: '/history' },
        { icon: FaClock, label: 'Watch Later', path: '/watch-later' },
        { icon: FaThumbsUp, label: 'Liked Videos', path: '/liked' },
    ];

    const explore = [
        { icon: FaFire, label: 'Trending', path: '/trending' },
        { icon: FaFilm, label: 'Movies', path: '/movies' },
        { icon: FaGamepad, label: 'Gaming', path: '/gaming' },
        { icon: FaNewspaper, label: 'News', path: '/news' },
        { icon: FaMusic, label: 'Music', path: '/music' },
        { icon: FaTshirt, label: 'Fashion', path: '/fashion' },
    ];

    const settings = [
        { icon: FaCog, label: 'Settings', path: '/settings' },
        { icon: FaFlag, label: 'Report History', path: '/report' },
        { icon: FaQuestionCircle, label: 'Help', path: '/help' },
        { icon: FaLightbulb, label: 'Feedback', path: '/feedback' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        if (window.innerWidth < 768 && onClose) {
            onClose();
        }
    };

    return (
        <>
            {isOpen && (
                <div className="sidebar-overlay" onClick={onClose}></div>
            )}

            <nav className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-section">
                    {mainMenu.map((item) => (
                        <div
                            key={item.label}
                            className="sidebar-item"
                            onClick={() => handleNavigation(item.path)}
                        >
                            <item.icon className="sidebar-icon" />
                            <span className="sidebar-label">{item.label}</span>
                        </div>
                    ))}
                </div>

                <div className="sidebar-divider"></div>

                <div className="sidebar-section">
                    <div className="sidebar-section-title">Library</div>
                    {library.map((item) => (
                        <div
                            key={item.label}
                            className="sidebar-item"
                            onClick={() => handleNavigation(item.path)}
                        >
                            <item.icon className="sidebar-icon" />
                            <span className="sidebar-label">{item.label}</span>
                        </div>
                    ))}
                </div>

                <div className="sidebar-divider"></div>

                <div className="sidebar-section">
                    <div className="sidebar-section-title">Explore</div>
                    {explore.map((item) => (
                        <div
                            key={item.label}
                            className="sidebar-item"
                            onClick={() => handleNavigation(item.path)}
                        >
                            <item.icon className="sidebar-icon" />
                            <span className="sidebar-label">{item.label}</span>
                        </div>
                    ))}
                </div>

                <div className="sidebar-divider"></div>

                <div className="sidebar-section">
                    <div className="sidebar-section-title">More from YouTube</div>
                    <div className="sidebar-item">
                        <FaYoutube className="sidebar-icon" />
                        <span className="sidebar-label">YouTube Premium</span>
                    </div>
                    <div className="sidebar-item">
                        <FaYoutube className="sidebar-icon" />
                        <span className="sidebar-label">YouTube Studio</span>
                    </div>
                    <div className="sidebar-item">
                        <FaYoutube className="sidebar-icon" />
                        <span className="sidebar-label">YouTube Music</span>
                    </div>
                    <div className="sidebar-item">
                        <FaYoutube className="sidebar-icon" />
                        <span className="sidebar-label">YouTube Kids</span>
                    </div>
                </div>

                <div className="sidebar-divider"></div>

                <div className="sidebar-section">
                    {settings.map((item) => (
                        <div
                            key={item.label}
                            className="sidebar-item"
                            onClick={() => handleNavigation(item.path)}
                        >
                            <item.icon className="sidebar-icon" />
                            <span className="sidebar-label">{item.label}</span>
                        </div>
                    ))}
                </div>

                <div className="sidebar-footer">
                    <span>© 2026 YouTube Clone</span>
                </div>
            </nav>
        </>
    );
};

export default Sidebar;