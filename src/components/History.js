import React, { useState } from 'react';
import { motion } from 'framer-motion';

const History = () => {
  const [activeTab, setActiveTab] = useState('scores'); // 'scores' or 'wrong'
  const scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
  const wrongAnswers = JSON.parse(localStorage.getItem('wrongAnswers') || '[]');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyLabel = (difficulty) => {
    const labels = {
      beginner: '초급',
      intermediate: '중급',
      advanced: '고급'
    };
    return labels[difficulty] || difficulty;
  };

  return (
    <motion.div 
      className="history-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="history-tabs">
        <button 
          className={`tab-button ${activeTab === 'scores' ? 'active' : ''}`}
          onClick={() => setActiveTab('scores')}
        >
          학습 기록
        </button>
        <button 
          className={`tab-button ${activeTab === 'wrong' ? 'active' : ''}`}
          onClick={() => setActiveTab('wrong')}
        >
          오답 노트
        </button>
      </div>

      <div className="history-content">
        {activeTab === 'scores' ? (
          <div className="scores-grid">
            {scores.slice().reverse().map((score, index) => (
              <motion.div 
                key={index}
                className="score-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="score-header">
                  <span className="difficulty-badge">
                    {getDifficultyLabel(score.difficulty)}
                  </span>
                  <span className="score-date">{formatDate(score.date)}</span>
                </div>
                <div className="score-main">
                  <div className="score-value">
                    {score.score}/{score.total}
                  </div>
                  <div className="score-percentage">
                    {Math.round((score.score / score.total) * 100)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="wrong-answers-grid">
            {wrongAnswers.slice().reverse().map((item, index) => (
              <motion.div 
                key={index}
                className="wrong-answer-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="wrong-answer-header">
                  <span className="difficulty-badge">
                    {getDifficultyLabel(item.difficulty)}
                  </span>
                  <span className="wrong-date">{formatDate(item.date)}</span>
                </div>
                <div className="wrong-answer-content">
                  <p className="english-sentence">{item.englishSentence}</p>
                  <div className="answer-comparison">
                    <p className="wrong-choice">
                      <span>선택한 답:</span> {item.selectedAnswer}
                    </p>
                    <p className="correct-answer">
                      <span>정답:</span> {item.correctAnswer}
                    </p>
                  </div>
                  <p className="explanation">{item.explanation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default History; 