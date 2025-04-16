'use client';

import React, { useState } from 'react';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div>
      <Navbar onHamburgerClick={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onLinkClick={closeSidebar} />
      <main
        style={{
          paddingTop: '80px',
          paddingLeft: sidebarOpen ? '260px' : '20px',
          transition: 'padding-left 0.3s ease',
        }}
      >
        {children}
      </main>
    </div>
  );
}