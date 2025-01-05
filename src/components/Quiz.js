import React, { useState } from 'react';
import { quizData } from '../data/quizData';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Quiz = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [questions, setQuestions] = useState(() => {
    // 초기에는 중간 난이도의 문제로 시작
    return shuffleQuestions(shuffleArray(quizData.intermediate).slice(0, 1));
  });
  const [remainingQuestions, setRemainingQuestions] = useState({
    beginner: [...quizData.beginner],
    intermediate: [...quizData.intermediate],
    advanced: [...quizData.advanced]
  });
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState('intermediate');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // 배열을 무작위로 섞는 함수
  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  // 문제와 보기를 섞는 함수
  function shuffleQuestions(questions) {
    return questions.map(question => {
      const options = [...question.options];
      const correctAnswer = options[question.correctAnswer];
      const shuffledOptions = shuffleArray(options);
      const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
      
      return {
        ...question,
        options: shuffledOptions,
        correctAnswer: newCorrectIndex
      };
    });
  }

  // 다음 문제의 난이도를 결정하는 함수
  const getNextDifficulty = () => {
    if (consecutiveCorrect >= 2) {
      // 2번 연속 정답 시 난이도 상승
      return currentDifficulty === 'beginner' ? 'intermediate' : 'advanced';
    } else if (consecutiveWrong >= 2) {
      // 2번 연속 오답 시 난이도 하락
      return currentDifficulty === 'advanced' ? 'intermediate' : 'beginner';
    }
    return currentDifficulty;
  };

  // 다음 문제를 가져오는 함수
  const getNextQuestion = () => {
    const nextDifficulty = getNextDifficulty();
    const availableQuestions = remainingQuestions[nextDifficulty];

    if (availableQuestions.length === 0) {
      // 해당 난이도의 문제가 없으면 현재 난이도 유지
      return getNextQuestion(currentDifficulty);
    }

    // 랜덤하게 문제 선택
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const nextQuestion = availableQuestions[randomIndex];

    // 선택된 문제 제거
    setRemainingQuestions(prev => ({
      ...prev,
      [nextDifficulty]: prev[nextDifficulty].filter((_, index) => index !== randomIndex)
    }));

    setCurrentDifficulty(nextDifficulty);
    return shuffleQuestions([nextQuestion])[0];
  };

  const handleAnswerClick = (selectedOption) => {
    setSelectedAnswer(selectedOption);
    const correct = selectedOption === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      setConsecutiveCorrect(prev => prev + 1);
      setConsecutiveWrong(0);
    } else {
      setConsecutiveCorrect(0);
      setConsecutiveWrong(prev => prev + 1);
      const wrongAnswers = JSON.parse(localStorage.getItem('wrongAnswers') || '[]');
      const wrongAnswer = {
        date: new Date().toISOString(),
        difficulty: currentDifficulty,
        englishSentence: questions[currentQuestion].englishSentence,
        selectedAnswer: questions[currentQuestion].options[selectedOption],
        correctAnswer: questions[currentQuestion].options[questions[currentQuestion].correctAnswer],
        explanation: questions[currentQuestion].explanation
      };
      localStorage.setItem('wrongAnswers', JSON.stringify([...wrongAnswers, wrongAnswer]));
    }
    
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    const nextQuestion = currentQuestion + 1;

    if (nextQuestion < 10) {  // 총 10문제
      setCurrentQuestion(nextQuestion);
      const newQuestion = getNextQuestion();
      setQuestions(prev => [...prev, newQuestion]);
    } else {
      setShowScore(true);
      const previousScores = JSON.parse(localStorage.getItem('quizScores') || '[]');
      const newScore = {
        date: new Date().toISOString(),
        score: score,
        total: 10,
        difficulty: 'adaptive'
      };
      localStorage.setItem('quizScores', JSON.stringify([...previousScores, newScore]));
    }
  };

  if (!gameStarted) {
    return (
      <motion.div 
        className="start-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1>적응형 영어 관용구 퀴즈</h1>
        <div className="game-description">
          <h2>게임 설명</h2>
          <ul>
            <li>총 10개의 문제가 출제됩니다</li>
            <li>실력에 따라 문제 난이도가 자동으로 조절됩니다</li>
            <li>2문제 연속 정답 시 난이도가 상승합니다</li>
            <li>2문제 연속 오답 시 난이도가 하락합니다</li>
          </ul>
          <div className="difficulty-info">
            <div className="difficulty-level">
              <span className="badge beginner">초급</span>
              <p>기초 영어 표현</p>
            </div>
            <div className="difficulty-level">
              <span className="badge intermediate">중급</span>
              <p>일상적인 관용구</p>
            </div>
            <div className="difficulty-level">
              <span className="badge advanced">고급</span>
              <p>복잡한 관용구와 표현</p>
            </div>
          </div>
        </div>
        <button 
          className="start-button"
          onClick={() => setGameStarted(true)}
        >
          시작하기
        </button>
      </motion.div>
    );
  }

  if (showScore) {
    return (
      <motion.div 
        className="score-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="score-card">
          <h2>퀴즈 결과</h2>
          <div className="score-details">
            <div className="score-circle">
              <div className="score-text">
                <span className="score-number">{score}</span>
                <span className="score-total">/10</span>
              </div>
              <div className="score-label">정답</div>
            </div>
            <div className="score-stats">
              <div className="stat-item">
                <span className="stat-label">정답률</span>
                <span className="stat-value">{Math.round((score / 10) * 100)}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">최고 난이도</span>
                <span className={`difficulty-badge ${currentDifficulty}`}>
                  {currentDifficulty === 'beginner' ? '초급' : 
                   currentDifficulty === 'intermediate' ? '중급' : '고급'}
                </span>
              </div>
            </div>
          </div>
          <div className="score-message">
            {score === 10 ? '완벽합니다! 🎉' :
             score >= 7 ? '잘 하셨습니다! 👏' :
             score >= 4 ? '좋은 시도였습니다! 💪' :
             '다음에는 더 잘할 수 있을 거예요! 😊'}
          </div>
          <div className="button-group">
            <button className="primary-button" onClick={() => window.location.reload()}>
              다시 도전하기
            </button>
            <button className="secondary-button" onClick={() => navigate('/history')}>
              학습 기록 보기
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="quiz-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="progress-bar">
        <div className="progress-info">
          <span className="question-counter">
            {currentQuestion + 1} / 10
          </span>
          <span className={`difficulty-badge ${currentDifficulty}`}>
            {currentDifficulty === 'beginner' ? '초급' : 
             currentDifficulty === 'intermediate' ? '중급' : '고급'}
          </span>
        </div>
        <div className="progress-track">
          <div 
            className="progress-fill"
            style={{ width: `${((currentQuestion + 1) / 10) * 100}%` }}
          />
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentQuestion}
          className="question-section"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
        >
          <div className="question-content">
            <div className="question-text">
              {questions[currentQuestion].englishSentence}
            </div>
            <div className="answer-options">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  className={`answer-button ${
                    showFeedback
                      ? index === questions[currentQuestion].correctAnswer
                        ? 'correct'
                        : index === selectedAnswer
                        ? 'incorrect'
                        : ''
                      : selectedAnswer === index
                      ? 'selected'
                      : ''
                  }`}
                  disabled={showFeedback}
                >
                  {option}
                </button>
              ))}
            </div>
            {showFeedback && (
              <motion.div 
                className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="feedback-content">
                  <p>{isCorrect ? '정답입니다!' : '틀렸습니다.'}</p>
                  <p>{questions[currentQuestion].explanation}</p>
                </div>
                <button onClick={handleNextQuestion}>다음 문제</button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default Quiz; 