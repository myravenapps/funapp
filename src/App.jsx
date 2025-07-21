import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomePage from './components/HomePage';
import CameraPage from './components/CameraPage';
import ResultPage from './components/ResultPage';
import './App.css';

function App() {
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [roastResult, setRoastResult] = useState(null);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Routes>
          <Route 
            path="/" 
            element={<HomePage />} 
          />
          <Route 
            path="/camera" 
            element={
              <CameraPage 
                setCurrentPhoto={setCurrentPhoto}
                setRoastResult={setRoastResult}
              />
            } 
          />
          <Route 
            path="/result" 
            element={
              <ResultPage 
                photo={currentPhoto}
                result={roastResult}
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;