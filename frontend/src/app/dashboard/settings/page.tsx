'use client';

import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
  const user = {
    email: 'Mahrukh@123',
    username: 'MS',
  };

  const defaultPrefs = {
    diabetic: false,
    vegan: false,
    lowSodium: false,
    halal: false,
    lactoseIntolerant: false,
    lowFat: false,
    highProtein: false,
  };

  const [prefs, setPrefs] = useState(defaultPrefs);

  useEffect(() => {
    const stored = localStorage.getItem('preferences');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Merge stored prefs with defaults to avoid missing keys
        setPrefs({ ...defaultPrefs, ...parsed });
      } catch (e) {
        console.error('Error parsing stored preferences:', e);
      }
    }
  }, []);

  const handleLogout = () => {
    alert('Logging out...');
    // TODO: implement logout logic
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPrefs((prev) => ({ ...prev, [name]: checked }));
  };

  const savePrefs = () => {
    localStorage.setItem('preferences', JSON.stringify(prefs));
    alert('Preferences saved!');
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
        onClick={() => alert('Change password logic coming soon!')}
      >
        Change Password
      </button>

      <button
        style={{
          padding: '10px 20px',
          backgroundColor: '#ff6b6b',
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

      <hr style={{ margin: '30px 0', border: '1px solid #a2a2a2' }} />

      <h2 style={{ fontSize: '22px', marginBottom: '15px' }}>Dietary Preferences</h2>

      {Object.entries(defaultPrefs).map(([name, _]) => (
        <label key={name} style={{ display: 'block', marginBottom: '10px' }}>
          <input
            type="checkbox"
            name={name}
            checked={prefs[name as keyof typeof prefs] || false}
            onChange={handleChange}
          />{' '}
          {name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())}
        </label>
      ))}

      <button
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          border: 'none',
          borderRadius: '6px',
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '20px',
        }}
        onClick={savePrefs}
      >
        Save Preferences
      </button>
    </div>
  );
}
