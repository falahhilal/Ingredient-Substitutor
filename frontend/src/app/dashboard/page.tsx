'use client';

import React from 'react';

export default function DashboardPage() {
  const username = 'Mahrukh';

  return (
    <div
      style={{
        paddingTop: '80px',
        paddingLeft: '20px',
        color: '#4f4f4f', 
      }}
    >
      <h1 style={{ fontSize: '36px', fontWeight: 'bold' }}>
        Hi {username}!
      </h1>
    </div>
  );
}
