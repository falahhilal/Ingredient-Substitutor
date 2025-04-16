'use client';

import React from 'react';

interface NavbarProps {
  onHamburgerClick: () => void;
}

const navbarStyle: React.CSSProperties = {
  width: '100%',
  height: '60px',
  backgroundColor: '#6e6e6e',
  display: 'flex',
  alignItems: 'center',
  padding: '0 20px',
  boxSizing: 'border-box',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1000,
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

const Navbar: React.FC<NavbarProps> = ({ onHamburgerClick }) => {
  return (
    <div style={navbarStyle}>
      <div style={hamburgerStyle} onClick={onHamburgerClick}>
        <div style={lineStyle}></div>
        <div style={lineStyle}></div>
        <div style={lineStyle}></div>
      </div>
    </div>
  );
};

export default Navbar;