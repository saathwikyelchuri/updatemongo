import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartScreen from './StartScreen';
import Quiz from './Quiz';
import AnimalGame from './AnimalGame';
import MemoryGame from './MemoryGame';
import Report from './Report';
import '../styles/App.css';

function App() {
  const [gameStage, setGameStage] = useState('start');
  const [isAdmin, setIsAdmin] = useState(false);
  const [childName, setChildName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [allSessions, setAllSessions] = useState([]);

  const handleAdminLogin = () => {
    setIsAdmin(true);  // Update state to reflect admin login
  };

  const handleStartQuiz = (name, sid) => {
    setChildName(name);
    setSessionId(sid);
    setGameStage('quiz');
  };

  const handleAddSession = (sessionData) => {
    setAllSessions((prev) => [...prev, sessionData]);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Route for the home/start page */}
          <Route
            path="/"
            element={
              isAdmin ? (
                <Report allSessions={allSessions} />
              ) : (
                <StartScreen
                  onStartQuiz={(name, sid) => {
                    setChildName(name);
                    setSessionId(sid);
                    setGameStage('quiz');
                  }}
                  onAdminLogin={handleAdminLogin}  // Handle admin login
                />
              )
            }
          />
          
          {/* Route for the quiz game */}
          <Route
            path="/quiz"
            element={
              <Quiz
                onQuizEnd={(score, expressionTally) => {
                  const sessionData = {
                    childName,
                    sessionId,
                    quizScore: score,
                    expressionTally,
                  };
                  handleAddSession(sessionData);
                  setGameStage('animalGame');
                }}
                childName={childName}
                sessionId={sessionId}
              />
            }
          />
          
          {/* Route for the animal game */}
          <Route
            path="/animal-game"
            element={
              <AnimalGame
                onFinish={(score) => {
                  setAllSessions((prev) =>
                    prev.map((session) =>
                      session.sessionId === sessionId
                        ? { ...session, animalGameScore: score }
                        : session
                    )
                  );
                  setGameStage('memoryGame');
                }}
                childName={childName}
                sessionId={sessionId}
              />
            }
          />

          {/* Route for the memory game */}
          <Route
            path="/memory-game"
            element={
              <MemoryGame
                onFinish={(score) => {
                  setAllSessions((prev) =>
                    prev.map((session) =>
                      session.sessionId === sessionId
                        ? { ...session, memoryGameScore: score }
                        : session
                    )
                  );
                  setGameStage('start');
                }}
                childName={childName}
                sessionId={sessionId}
              />
            }
          />
          
          {/* Route for the admin report page */}
          <Route path="/report" element={<Report allSessions={allSessions} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

