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

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setError('');
    console.log('Form submitted:', { email, username, password });

    router.push('/dashboard');
  };

  return (
    <div style={formContainerStyle}>
      <h1 style={titleStyle}>SIGN UP</h1>
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
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <button type="submit" style={buttonStyle}>Signup</button>
      </form>
    </div>
  );
}
