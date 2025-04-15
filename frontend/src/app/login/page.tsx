import React from 'react';

const formContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  color: '#000',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  margin: '10px',
  fontSize: '16px',
  cursor: 'pointer',
};

export default function LoginPage() {
  return (
    <div style={formContainerStyle}>
      <h1>Login</h1>
      <form>
        <div>
          <label>Email:</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit" style={buttonStyle}>Login</button>
      </form>
    </div>
  );
}
