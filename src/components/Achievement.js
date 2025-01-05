import React from 'react';
import { motion } from 'framer-motion';

const Achievement = () => {
  const badges = [
    {
      id: 'first_quiz',
      name: '첫 퀴즈 완료',
      icon: '🎯',
      condition: (stats) => stats.total >= 1
    },
    {
      id: 'perfect_score',
      name: '만점 달성',
      icon: '🏆',
      condition: (stats) => stats.perfectScores > 0
    },
    {
      id: 'study_streak',
      name: '3일 연속 학습',
      icon: '🔥',
      condition: (stats) => stats.streak >= 3
    }
  ];

  const stats = JSON.parse(localStorage.getItem('quizStats') || '{}');

  return (
    <motion.div 
      className="achievements"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2>나의 성취</h2>
      <div className="badges-container">
        {badges.map(badge => (
          <motion.div
            key={badge.id}
            className={`badge ${badge.condition(stats) ? 'unlocked' : 'locked'}`}
            whileHover={{ scale: 1.1 }}
          >
            <div className="badge-icon">{badge.icon}</div>
            <div className="badge-name">{badge.name}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Achievement; 