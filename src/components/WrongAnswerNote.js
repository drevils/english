import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WrongAnswerNote = () => {
  const [filter, setFilter] = useState('all'); // 'all', 'beginner', 'intermediate'
  const wrongAnswers = JSON.parse(localStorage.getItem('wrongAnswers') || '[]');

  const filteredAnswers = filter === 'all' 
    ? wrongAnswers 
    : wrongAnswers.filter(answer => answer.difficulty === filter);

  return (
    <motion.div 
      className="wrong-answer-note"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2>오답 노트</h2>
      <div className="filter-buttons">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          전체
        </button>
        <button 
          className={filter === 'beginner' ? 'active' : ''} 
          onClick={() => setFilter('beginner')}
        >
          초급
        </button>
        <button 
          className={filter === 'intermediate' ? 'active' : ''} 
          onClick={() => setFilter('intermediate')}
        >
          중급
        </button>
      </div>
      <div className="wrong-answers-list">
        {filteredAnswers.map((item, index) => (
          <motion.div 
            key={index}
            className="wrong-answer-item"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3>{item.englishSentence}</h3>
            <p className="wrong-choice">선택한 답: {item.selectedAnswer}</p>
            <p className="correct-answer">정답: {item.correctAnswer}</p>
            <p className="explanation">{item.explanation}</p>
            <div className="date">
              {new Date(item.date).toLocaleDateString()}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WrongAnswerNote; 