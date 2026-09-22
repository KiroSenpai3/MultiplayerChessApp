import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../services/socket';
import { useGameContext } from '../context/GameContext';

export function useSocket() {
  const navigate = useNavigate();
  const {
    user,
    setMatchmakingState,
    setActiveGame,
    setUserColor,
    setDrawOffer,
    setDisconnectInfo,
    setGameResult,
  } = useGameContext();

  useEffect(() => {
    const socket = getSocket();

    function deriveUserColor(gameState) {
      if (!gameState) return null;
      const socket = getSocket();
      const socketId = socket ? socket.id : null;
      const userId = user?.sessionId;

      if (gameState.blackPlayer && (gameState.blackPlayer.id === userId || gameState.blackPlayer.socketId === socketId)) {
        return 'black';
      }
      if (gameState.whitePlayer && (gameState.whitePlayer.id === userId || gameState.whitePlayer.socketId === socketId)) {
        return 'white';
      }
      return null;
    }

    // Matchmaking Event Listeners
    function onQueued(data) {
      setMatchmakingState({ isSearching: true, message: data.message });
    }

    function onCancelled() {
      setMatchmakingState({ isSearching: false, message: '' });
    }

    function onMatchFound(data) {
      const { gameId, color } = data;
      setMatchmakingState({ isSearching: false, message: '' });
      setUserColor(color);
      navigate(`/game/${gameId}`);
    }

    // Game Event Listeners
    function onGameStarted(data) {
      setActiveGame(data.state);
      setGameResult(null);
      const color = deriveUserColor(data.state);
      if (color) setUserColor(color);
    }

    function onGameState(data) {
      setActiveGame(data.state);
      const color = data.userColor || deriveUserColor(data.state);
      if (color) setUserColor(color);
    }

    function onGameMove(data) {
      setActiveGame(data.state);
      const color = deriveUserColor(data.state);
      if (color) setUserColor(color);
    }

    function onGameEnded(data) {
      setActiveGame(data.state);
      setGameResult({
        reason: data.reason,
        winner: data.winner,
        message: data.message,
      });
    }

    function onOpponentDisconnected(data) {
      setDisconnectInfo({
        username: data.username,
        graceSeconds: data.graceSeconds,
      });
    }

    function onOpponentReconnected() {
      setDisconnectInfo(null);
    }

    function onDrawOffered(data) {
      setDrawOffer({ offeredBy: data.offeredBy });
    }

    function onDrawDeclined() {
      setDrawOffer(null);
    }

    socket.on('matchmaking:queued', onQueued);
    socket.on('matchmaking:cancelled', onCancelled);
    socket.on('matchmaking:found', onMatchFound);

    socket.on('game:started', onGameStarted);
    socket.on('game:state', onGameState);
    socket.on('game:move', onGameMove);
    socket.on('game:ended', onGameEnded);

    socket.on('opponent:disconnected', onOpponentDisconnected);
    socket.on('opponent:reconnected', onOpponentReconnected);
    socket.on('game:draw_offered', onDrawOffered);
    socket.on('game:draw_declined', onDrawDeclined);

    return () => {
      socket.off('matchmaking:queued', onQueued);
      socket.off('matchmaking:cancelled', onCancelled);
      socket.off('matchmaking:found', onMatchFound);

      socket.off('game:started', onGameStarted);
      socket.off('game:state', onGameState);
      socket.off('game:move', onGameMove);
      socket.off('game:ended', onGameEnded);

      socket.off('opponent:disconnected', onOpponentDisconnected);
      socket.off('opponent:reconnected', onOpponentReconnected);
      socket.off('game:draw_offered', onDrawOffered);
      socket.off('game:draw_declined', onDrawDeclined);
    };
  }, [user, navigate, setMatchmakingState, setActiveGame, setUserColor, setDrawOffer, setDisconnectInfo, setGameResult]);

  /**
   * Action triggers
   */
  function startMatchmaking(customName) {
    const socket = getSocket();
    socket.emit('matchmaking:join', {
      userId: user?.sessionId || socket.id,
      username: customName || user?.username || 'Player',
    });
  }

  function cancelMatchmaking() {
    const socket = getSocket();
    socket.emit('matchmaking:cancel');
    setMatchmakingState({ isSearching: false, message: '' });
  }

  function makeMove(gameId, move) {
    const socket = getSocket();
    socket.emit('game:move', {
      gameId,
      userId: user?.sessionId || socket.id,
      move,
    });
  }

  function resignGame(gameId) {
    const socket = getSocket();
    socket.emit('game:resign', {
      gameId,
      userId: user?.sessionId || socket.id,
    });
  }

  function offerDraw(gameId) {
    const socket = getSocket();
    socket.emit('game:draw_offer', {
      gameId,
      userId: user?.sessionId || socket.id,
    });
  }

  function respondDraw(gameId, accept) {
    const socket = getSocket();
    socket.emit('game:draw_respond', {
      gameId,
      userId: user?.sessionId || socket.id,
      accept,
    });
    setDrawOffer(null);
  }

  function reconnectGame(gameId) {
    const socket = getSocket();
    socket.emit('game:reconnect', {
      gameId,
      userId: user?.sessionId || socket.id,
    });
  }

  return {
    startMatchmaking,
    cancelMatchmaking,
    makeMove,
    resignGame,
    offerDraw,
    respondDraw,
    reconnectGame,
  };
}
