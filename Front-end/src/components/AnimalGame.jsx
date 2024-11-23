/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import '../styles/AnimalGame.css';
import Capturing from './Capturing';
import { useNavigate } from 'react-router-dom';


const gameId=2;
const animals = [
  { name: 'lion', image: '🦁' },
  { name: 'tiger', image: '🐯' },
  { name: 'bear', image: '🐻' },
  { name: 'zebra', image: '🦓' },
  { name: 'elephant', image: '🐘' },
];

const getRandomAnimal = () => animals[Math.floor(Math.random() * animals.length)];

function AnimalGame({ onFinish , childName, sessionId}) {
  const navigate=useNavigate();
  const [currentAnimal, setCurrentAnimal] = useState(getRandomAnimal());
  const [letters, setLetters] = useState([]);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [position, setPosition] = useState({ x: 150, y: 150 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(7);

  // Lanes for vertical and horizontal movement
  const verticalLanes = [50, 150, 250, 350];
  const horizontalLanes = [50, 150, 250]; // Additional lanes for left and right movement

  // Generate letters with spacing between them
  useEffect(() => {
    if (score >= 5) {
      setGameOver(true);
      return;
    }

    const letterInterval = setInterval(() => {
      const randomLetter = currentAnimal.name[Math.floor(Math.random() * currentAnimal.name.length)];
      const randomLane = verticalLanes[Math.floor(Math.random() * verticalLanes.length)];

      const lastLetterInLane = letters.filter((l) => l.y === randomLane).slice(-1)[0];
      if (!lastLetterInLane || lastLetterInLane.x < 300) {
        setLetters((prevLetters) => [
          ...prevLetters,
          { letter: randomLetter, x: 400, y: randomLane },
        ]);
      }
    }, 1000);

    const updateLetterPositions = () => {
      setLetters((prevLetters) =>
        prevLetters.map((letter) => {
          const moveDistance = Math.min(speed, 10); // Cap the movement to prevent "jumping"
          return { ...letter, x: letter.x - moveDistance };
        })
      );
    };

    const gameInterval = setInterval(updateLetterPositions, 100);

    return () => {
      clearInterval(letterInterval);
      clearInterval(gameInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAnimal, score, speed]);

  // Increase speed incrementally with each score
  useEffect(() => {
    if (score > 0 && score % 1 === 0) {
      setSpeed((prevSpeed) => Math.min(prevSpeed + 2, 20)); // Increased speed increment, max 20
    }
  }, [score]);

  // Handle keyboard input for up, down, left, and right movement
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowUp') {
        setPosition((prev) => ({
          ...prev,
          y: verticalLanes[Math.max(verticalLanes.indexOf(prev.y) - 1, 0)],
        }));
      } else if (e.key === 'ArrowDown') {
        setPosition((prev) => ({
          ...prev,
          y: verticalLanes[Math.min(verticalLanes.indexOf(prev.y) + 1, verticalLanes.length - 1)],
        }));
      } else if (e.key === 'ArrowLeft') {
        setPosition((prev) => ({
          ...prev,
          x: horizontalLanes[Math.max(horizontalLanes.indexOf(prev.x) - 1, 0)],
        }));
      } else if (e.key === 'ArrowRight') {
        setPosition((prev) => ({
          ...prev,
          x: horizontalLanes[Math.min(horizontalLanes.indexOf(prev.x) + 1, horizontalLanes.length - 1)],
        }));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    const checkCollision = () => {
      letters.forEach((letter) => {
        const inHorizontalRange = letter.x < position.x + 50 && letter.x > position.x;
        const inVerticalRange = letter.y === position.y;

        if (inHorizontalRange && inVerticalRange) {
          const expectedLetter = currentAnimal.name[currentLetterIndex];

          if (letter.letter === expectedLetter) {
            setLetters((prevLetters) => prevLetters.filter((l) => l !== letter));
            setCurrentLetterIndex((prevIndex) => prevIndex + 1);

            if (currentLetterIndex + 1 === currentAnimal.name.length) {
              setScore((prevScore) => prevScore + 1);
              if (score + 1 >= 5) {
                setGameOver(true);
                navigate('/memory-game');
              } else {
                setCurrentAnimal(getRandomAnimal());
                setCurrentLetterIndex(0);
              }
            }
          } else {
            setGameOver(true);
            navigate('/memory-game');
          }
        }
      });
    };

    checkCollision();
  }, [letters, position, currentLetterIndex, currentAnimal, score]);


  return (
    <div className="game-container">
      <Capturing 
                childName={childName} 
                sessionId={sessionId} 
                gameId={gameId} 
                captureInterval={3000} 
                screenshotInterval={6000} 
                uploadUrl="http://localhost:3000/photos"
            />
       <h1>Animal Letter Game</h1>
       <p>Score: {score}</p>
       <h2>
         {currentAnimal.name.split('').map((letter, index) => (
           <span
             key={index}
             style={{ color: index < currentLetterIndex ? 'green' : 'black' }}
           >
             {letter.toUpperCase()}
           </span>
         ))}
       </h2>
      {gameOver ? (
        <button onClick={() => onFinish(score)}>Finish Game</button>
      ) : (
        <div className="game-area">
                   <div className="animal"
                    style={{ left: position.x, top: position.y }}
                  >
                    {currentAnimal.image}
                  </div>
                  {letters.map((letter, index) => (
                    <div
                      key={index}
                      className="letter"
                      style={{ left: letter.x, top: letter.y }}
                    >
                      {letter.letter}
                    </div>
                  ))}
                  <p className="instructions">Catch letters in order! Use arrow keys to move.</p>
                </div>
      )}
    </div>
  );
}

export default AnimalGame;



