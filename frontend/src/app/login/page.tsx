'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const formContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'auto',  
  minHeight: '300px',  
  backgroundColor: '#c9edb6',
  padding: '30px',
  borderRadius: '15px',
  width: '350px',
  margin: '0 auto',  
  position: 'absolute',  
  top: '50%',  
  left: '50%',  
  transform: 'translate(-50%, -50%)',  
};

const titleStyle: React.CSSProperties = {
  fontSize: '24px',
  color: 'black',
  marginBottom: '20px',
};

const inputStyle: React.CSSProperties = {
  padding: '10px',
  margin: '10px 0',
  fontSize: '16px',
  borderRadius: '15px',
  border: '1px solid #a2a2a2',
  backgroundColor: '#a2a2a2',
  color: 'white',
  width: '100%',
};

const buttonStyle: React.CSSProperties = {
  padding: '15px 30px',
  margin: '10px auto',
  fontSize: '16px',
  cursor: 'pointer',
  borderRadius: '15px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  display: 'block', 
  width: '200px',
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both fields!');
      return;
    }
    setError('');
    const loginData = { email, password };
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (data.success) {
          localStorage.setItem('name', data.name);
          localStorage.setItem('email', data.email);
          router.push('/dashboard');
        } else {
          setError('Invalid credentials!');
        }
      } else {
        setError(data.message || 'Something went wrong');
      }

    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again!');
    }
  };
  
  return (
    <div style={formContainerStyle}>
      <h1 style={titleStyle}>LOGIN</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <button type="submit" style={buttonStyle}>Login</button>
      </form>
    </div>
  );
}