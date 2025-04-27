/*'use client';

import React from 'react';

export default function DashboardPage() {
  useEffect(() => {
    // Retrieve the name from localStorage
    const storedName = localStorage.getItem('name');
    setName(storedName);
  }, []);

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
} */


'use client';

import React, { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    setName(storedName);
  }, []);

  if (!name) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: '80px',
        paddingLeft: '20px',
        color: '#4f4f4f', 
      }}
    >
      <h1 style={{ fontSize: '36px', fontWeight: 'bold' }}>
        Hi {name}!
      </h1>
    </div>
  );
}
