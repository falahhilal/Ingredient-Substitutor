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
  const [name, setname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Signup successful! Redirecting...');
        localStorage.setItem('name', data.name);
        localStorage.setItem('email', data.email);
        setTimeout(() => {
          router.push('/dashboard'); 
        }, 2000);
      } else {
        setError(data.error || 'Something went wrong');
      }
        /*setSuccessMessage('Signup successful! Redirecting...');    //to be removed
        localStorage.setItem('name', username);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);      */                                    //to be removed
    } catch (error) {
      setError('Error connecting to server!');
      console.error('Error:', error);
    }
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
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setname(e.target.value)}
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
        {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}
        <button type="submit" style={buttonStyle}>Signup</button>
      </form>
    </div>
  );
}
