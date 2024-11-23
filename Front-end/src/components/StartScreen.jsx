/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import "../styles/StartScreen.css";

import { useNavigate } from 'react-router-dom';




const StartScreen = ({ onStartQuiz, onAdminLogin }) => {
  const navigate=useNavigate();
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [childName, setChildName] = useState('');

  const correctAdminId = "123";
  const correctAdminPassword = "123";

  const handlePlayGame = async(e) => {
    e.preventDefault();
    if (childName.trim() !== '') {
      const sessionId = uuidv4(); // Generate unique session ID using UUID
      try {
        const response = await fetch('http://localhost:3000/login', { // Adjust endpoint to your backend route
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            childName,
            sessionId,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log('Session started successfully:', data);
        onStartQuiz(childName, sessionId); // Call the onStartQuiz function after successful API call
        navigate('/quiz')
      } catch (error) {
        console.error('Failed to start session:', error);
    }
    }
  };

  const handleAdminLoginClick = () => {
    setShowAdminLogin(true);
  };

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    if (adminId === correctAdminId && adminPassword === correctAdminPassword) {
      onAdminLogin();
      navigate("/report");

    } else {
      setLoginError("Incorrect Admin ID or Password.");
    }
  };

  return (
    <div className="start-screen">
      <h1>The React Quiz Game</h1>
      <form onSubmit={handlePlayGame}>
        <label htmlFor="childName">Enter child name:</label>
        <input 
          type="text" 
          id="childName" 
          name="childName" 
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      <button onClick={handleAdminLoginClick}>ADMIN LOGIN</button>

      {showAdminLogin && (
        <div className="admin-login-form">
          <h2>Admin Login</h2>
          <form onSubmit={handleAdminLoginSubmit}>
            <div className="input-group">
              <label htmlFor="adminId">Admin ID:</label>
              <input
                type="text"
                id="adminId"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="adminPassword">Password:</label>
              <input
                type="password"
                id="adminPassword"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </div>
            <button type="submit">Login</button>
            {loginError && <p className="error-message">{loginError}</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default StartScreen;
