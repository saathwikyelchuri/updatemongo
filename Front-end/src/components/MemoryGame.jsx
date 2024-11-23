/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import '../styles/MemoryGame.css';
import Capturing from './Capturing';
import { useNavigate } from 'react-router-dom';
const gameId=3;
const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#F3FF33', '#33FFF6', '#A6FF33', '#33A6FF'];

function MemoryGame({ onFinish, childName, sessionId }) {
  const navigate=useNavigate();
  const [grid, setGrid] = useState(Array(16).fill(null));
  const [selectedBoxes, setSelectedBoxes] = useState([]);
  const [score, setScore] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(15);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [revealed, setRevealed] = useState(true);
  const [gameWon, setGameWon] = useState(false); // Track if the game has been won
 
  useEffect(() => {
    initializeGrid();

    // Reveal grid colors for 5 seconds
    const revealTimeout = setTimeout(() => {
      setRevealed(false); // Hide colors after 5 seconds
    }, 5000);

    return () => clearTimeout(revealTimeout); // Clean up timeout if component unmounts
  }, []);

  function initializeGrid() {
    let tempGrid = Array(16).fill(null);
    let pairs = [...colors, ...colors];
    pairs = pairs.sort(() => Math.random() - 0.5);

    pairs.forEach((color, index) => {
      tempGrid[index] = color;
    });

    setGrid(tempGrid);
  }

  function handleBoxClick(index) {
    if (!gameWon && selectedBoxes.length < 2 && !selectedBoxes.includes(index) && !matchedPairs.includes(grid[index])) {
      const newSelected = [...selectedBoxes, index];
      setSelectedBoxes(newSelected);

      // Delay the match check to allow the color to be revealed
      if (newSelected.length === 2) {
        setTimeout(() => checkMatch(newSelected), 300); // Add a short delay of 300ms
      }
    }
  }

  function checkMatch(newSelected) {
    const [first, second] = newSelected;

    // Check if they match
    if (grid[first] === grid[second]) {
      setMatchedPairs([...matchedPairs, grid[first]]);
      setScore(score + 1);
      setSelectedBoxes([]);
    } else {
      setTimeout(() => setSelectedBoxes([]), 1000);
    }

    // Decrease attemptsLeft after each attempt
    const newAttemptsLeft = attemptsLeft - 1;
    setAttemptsLeft(newAttemptsLeft);
    // Check for win condition (8 pairs match)
    if (score + 1 === 8) {
      setGameWon(true); // Set gameWon to true when player wins
      alert(`Congratulations! You've won! Please proceed to the interface for your report.`);
      if (onFinish) onFinish(score); // Call onFinish with the winning score
      navigate('/');
    }
    // Check if attempts are exhausted
    else if (newAttemptsLeft === 0 && !gameWon) {
      alert(`Game Over! Session ID: You have run out of attempts. Please proceed to the interface for your report.`);
      if (onFinish) onFinish(score); // Call onFinish with the final score
      navigate('/')
    }
  }

  return (
    <div>
     <Capturing 
                childName={childName} 
                sessionId={sessionId} 
                gameId={gameId} 
                captureInterval={3000} 
                screenshotInterval={6000} 
                uploadUrl="http://localhost:3000/photos"
            />
    
      <h1>Memory Game</h1>
      <h2>Score: {score}</h2>
      <h2>Attempts Left: {attemptsLeft}</h2> {/* Display attempts left */}
      
      {gameWon ? (
        <h2>Congratulations! You&apos;ve won with a score of {score}!</h2>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '320px', margin: '0 auto' }}>
          {grid.map((color, index) => (
            <div
              key={index}
              className="box"
              style={{
                width: '70px',
                height: '70px',
                margin: '5px',
                backgroundColor:
                  revealed || selectedBoxes.includes(index) || matchedPairs.includes(color)
                    ? color
                    : '#ccc',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onClick={() => handleBoxClick(index)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MemoryGame;



