import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectSocket, getSocket } from '../services/socket';
import { getOrCreateUser } from '../services/api';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [user, setUser] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [matchmakingState, setMatchmakingState] = useState({
    isSearching: false,
    message: '',
  });
  const [activeGame, setActiveGame] = useState(null);
  const [userColor, setUserColor] = useState('white');
  const [drawOffer, setDrawOffer] = useState(null);
  const [disconnectInfo, setDisconnectInfo] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  // Initialize persistent guest user session
  useEffect(() => {
    async function initUser() {
      let sessionId = sessionStorage.getItem('multchess_session_id');
      if (!sessionId) {
        sessionId = `sess_${Math.random().toString(36).substring(2, 10)}`;
        sessionStorage.setItem('multchess_session_id', sessionId);
      }
      const existingName = sessionStorage.getItem('multchess_username') || `Player_${sessionId.substring(5, 9)}`;
      
      try {
        const res = await getOrCreateUser(sessionId, existingName);
        if (res.success) {
          setUser(res.user);
        }
      } catch (err) {
        setUser({ sessionId, username: existingName });
      }
    }
    initUser();
  }, []);

  // Connect socket and listen to core lifecycle
  useEffect(() => {
    const socket = connectSocket();

    function onConnect() {
      setSocketConnected(true);
    }
    function onDisconnect() {
      setSocketConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    if (socket.connected) {
      setSocketConnected(true);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const value = {
    user,
    setUser,
    socketConnected,
    matchmakingState,
    setMatchmakingState,
    activeGame,
    setActiveGame,
    userColor,
    setUserColor,
    drawOffer,
    setDrawOffer,
    disconnectInfo,
    setDisconnectInfo,
    gameResult,
    setGameResult,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  return useContext(GameContext);
}
