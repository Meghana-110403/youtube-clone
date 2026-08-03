import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Search from './pages/Search';
import Trending from './pages/Trending';
import Liked from './pages/Liked';
import History from './pages/History';
import Subscriptions from './pages/Subscriptions';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <main className={`main-content ${isSidebarOpen ? 'sidebar-active' : ''}`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/watch/:id" element={<Watch />} />
              <Route path="/search" element={<Search />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/liked" element={<Liked />} />
              <Route path="/history" element={<History />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;