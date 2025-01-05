import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Quiz from './components/Quiz';
import History from './components/History';
import './styles/Quiz.css';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <nav className="nav-menu">
            <Link to="/">퀴즈</Link>
            <Link to="/history">학습 기록</Link>
          </nav>
          
          <Routes>
            <Route path="/" element={<Quiz />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
