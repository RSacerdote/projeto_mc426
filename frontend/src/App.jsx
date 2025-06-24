import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import RewardsShop from './pages/RewardsShop';
import './App.css';
import './MainLayout.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="app-container">
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          &#9776;
        </div>

        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rewards" element={<RewardsShop />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;