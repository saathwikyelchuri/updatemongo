/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Question from './Question';
import { questions } from '../data/questions';
import '../styles/Quiz.css';
import Capturing from './Capturing';
import { useNavigate } from 'react-router-dom';

const Quiz = ({ onQuizEnd, childName, sessionId }) => {
  const navigate=useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [time, setTime] = useState(15);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const gameId = 1;

  useEffect(() => {
    const level1Questions = questions.level1
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
    setShuffledQuestions(level1Questions);
  }, []);

  useEffect(() => {
    if (time === 0) handleNextQuestion();
    const timer = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  const handleNextQuestion = () => {
    if (selectedAnswer === shuffledQuestions[questionIndex].answer) {
      setScore(score + 1);
    }

    setSelectedAnswer(null);
    setQuestionIndex(questionIndex + 1);
    setTime(15);

    if (questionIndex + 1 === shuffledQuestions.length) {
      onQuizEnd(score);
      navigate('/animal-game');
    }
  };

  return (
    <div className="quiz">
      <Capturing 
        childName={childName} 
        sessionId={sessionId} 
        gameId={gameId} 
        captureInterval={3000} 
        screenshotInterval={6000} 
        uploadUrl="http://localhost:3000/photos"
      />
      <h2>Question {questionIndex + 1} / {shuffledQuestions.length}</h2>
      <p className="timer">Time: {time}s</p>
      {shuffledQuestions[questionIndex] && (
        <Question question={shuffledQuestions[questionIndex]} onAnswerSelect={setSelectedAnswer} />
      )}
      <button className="next-button" onClick={handleNextQuestion}>Next</button>
    </div>
  );
};

export default Quiz;




