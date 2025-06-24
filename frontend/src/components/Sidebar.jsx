import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={toggleSidebar}>&times;</button>
      <nav>
        <ul>
          <li>
            <Link to="/" onClick={toggleSidebar}>Home (Mapa)</Link>
          </li>
          <li>
            <Link to="/rewards" onClick={toggleSidebar}>Loja de Recompensas</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;