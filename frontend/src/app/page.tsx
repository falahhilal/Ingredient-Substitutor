'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  // Function to navigate to login page
  const goToLogin = () => {
    router.push('/login');
  };

  // Function to navigate to signup page
  const goToSignup = () => {
    router.push('/signup');
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#000',
      }}
    >
      <h1>Welcome to My App</h1>
      <div>
        <button onClick={goToLogin} style={buttonStyle}>Login</button>
        <button onClick={goToSignup} style={buttonStyle}>Signup</button>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  margin: '10px',
  fontSize: '16px',
  cursor: 'pointer',
};

