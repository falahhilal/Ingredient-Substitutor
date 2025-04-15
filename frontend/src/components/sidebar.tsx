import React from 'react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: isOpen ? '0' : '-250px', 
        width: '250px',
        height: '100%',
        backgroundColor: '#c9edb6',
        color: 'white',
        transition: 'left 0.3s ease', 
        padding: '20px',
        overflow: 'hidden', 
      }}
    >
      <h2>Sidebar</h2>
      <ul>
        <li>Dashboard</li>
        <li>Settings</li>
        <li>Profile</li>
      </ul>
    </div>
  );
};

export default Sidebar;
