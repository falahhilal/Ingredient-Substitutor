'use client';

import React from 'react';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onLinkClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onLinkClick }) => {
  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: '60px',
    left: 0,
    width: '250px',
    height: 'calc(100vh - 60px)',
    backgroundColor: '#c9edb6',
    padding: '20px',
    boxSizing: 'border-box',
    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s ease-in-out',
    zIndex: 999,
  };

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '33.33%', 
    borderBottom: '2px solid #a2a2a2',
    fontWeight: 'bold',
    color: '#4f4f4f',
    textAlign: 'center',
    cursor: 'pointer',
    width: '100%',
  };

  const lastSectionStyle: React.CSSProperties = {
    ...sectionStyle,
    borderBottom: 'none', 
  };

  return (
    <div style={sidebarStyle}>
      <div style={sectionStyle}>
        <Link href="/dashboard/search" style={{ textDecoration: 'none', color: 'inherit' }} onClick={onLinkClick}>
          Search Substitute
        </Link>
      </div>
      <div style={sectionStyle}>
        <Link href="/dashboard/my_recipes" style={{ textDecoration: 'none', color: 'inherit' }} onClick={onLinkClick}>
          My Recipes
        </Link>
      </div>
      <div style={lastSectionStyle}>
        <Link href="/dashboard/settings" style={{ textDecoration: 'none', color: 'inherit' }} onClick={onLinkClick}>
          Settings
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
