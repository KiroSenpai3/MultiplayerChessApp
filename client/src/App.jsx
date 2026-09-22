import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { useSocket } from './hooks/useSocket';
import { Home } from './pages/Home';
import { Game } from './pages/Game';

function AppRoutes() {
  // Activate global socket event listeners
  useSocket();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:gameId" element={<Game />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <GameProvider>
        <AppRoutes />
      </GameProvider>
    </Router>
  );
}
