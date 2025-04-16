'use client';

import React from 'react';

export default function SettingsPage() {
  // Placeholder user data 
  const user = {
    email: 'Mahrukh@123',
    username: 'MS',
  };

  const handleLogout = () => {
    alert('Logging out...'); 
    
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#c9edb6',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        color: '#4f4f4f',
      }}
    >
      <h1 style={{ fontSize: '28px', marginBottom: '30px' }}>Account Settings</h1>

      <div style={{ marginBottom: '20px' }}>
        <strong>Username:</strong> {user.username}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong>Email:</strong> {user.email}
      </div>

      <button
        style={{
          padding: '10px 20px',
          backgroundColor: '#a2a2a2',
          border: 'none',
          borderRadius: '6px',
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginRight: '10px',
        }}
        onClick={() => alert('(DB logic pending)')}
      >
        Change Password
      </button>

      <button
        style={{
          padding: '10px 20px',
          backgroundColor: '#ff6b6b', //logout button
          border: 'none',
          borderRadius: '6px',
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '20px',
        }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
