'use client';

import React, { useState } from 'react';
import Sidebar from './sidebar';

const navbarStyle: React.CSSProperties = {
  width: '100%',
  height: '60px',
  backgroundColor: '#c9edb6',
  display: 'flex',
  alignItems: 'center',
  padding: '0 20px',
  boxSizing: 'border-box',
};

const hamburgerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '24px',
  height: '18px',
  cursor: 'pointer',
};

const lineStyle: React.CSSProperties = {
  width: '100%',
  height: '3px',
  backgroundColor: '#a2a2a2',
  borderRadius: '2px',
};

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div style={navbarStyle}>
      <div onClick={toggleSidebar} style={hamburgerStyle}>
        <div style={lineStyle}></div>
        <div style={lineStyle}></div>
        <div style={lineStyle}></div>
      </div>

      <Sidebar isOpen={sidebarOpen} />
    </div>
  );
}