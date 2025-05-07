import React from 'react';
import './Header.css'; // Import the CSS file for styling

const Header: React.FC = () => {
  return (
    <div className="header-container">
      <div className="header-content">
        <h1>Ben and Jerry's</h1>
        <h2>Warehouse Management System</h2>
      </div>
    </div>
  );
};

export default Header;