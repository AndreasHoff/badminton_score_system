import { Court } from './Court'
import './MatchScreen.css'
import { useEffect, useState } from 'react'

export function MatchScreen({ 
  gameState, 
  onScorePoint, 
  onResetGame, 
  getCurrentServer,
  getGameState,
  checkGameWon,
  shouldShowBreak,
  shouldChangeEnds,
  startNextGame,
}) {
  const currentServer = getCurrentServer()
  const currentGameState = getGameState()
  const gameWonStatus = checkGameWon()
  const [showNotification, setShowNotification] = useState(null)

  // Handle game won
  useEffect(() => {
    if (gameWonStatus.won && !gameState.matchWon) {
      setShowNotification({
        type: 'game-won',
        winner: gameWonStatus.winner,
      })
    }
  }, [gameWonStatus.won, gameWonStatus.winner, gameState.matchWon])

  // Handle break at 8
  useEffect(() => {
    if (shouldShowBreak()) {
      setShowNotification({
        type: 'break',
        message: '1-minute break',
      })
    }
  }, [gameState.teamA.score, gameState.teamB.score])

  // Handle end change in game 3
  useEffect(() => {
    if (shouldChangeEnds()) {
      setShowNotification({
        type: 'end-change',
        message: 'Change ends',
      })
    }
  }, [gameState.teamA.score, gameState.teamB.score, gameState.currentGame])

  const handleContinue = () => {
    if (showNotification?.type === 'game-won') {
      startNextGame(gameWonStatus.winner)
    }
    setShowNotification(null)
  }

  const getGameStateLabel = () => {
    switch (currentGameState) {
      case 'sudden-death':
        return '⚠️ SUDDEN DEATH - Next point wins!'
      case 'extension':
        return '🔥 Extension - Need 2-point lead'
      default:
        return '🎯 Play to 15 points'
    }
  }

  return (
    <div className="match-screen">
      {/* Notification Overlay */}
      {showNotification && (
        <div className="notification-overlay">
          <div className="notification-box">
            {showNotification.type === 'game-won' && (
              <>
                <h2>🏆 Game {gameState.currentGame} Won!</h2>
                <p className="winner-text">
                  Team {showNotification.winner} wins this game!
                </p>
                <p className="score-text">
                  Final Score: {gameState.teamA.score} - {gameState.teamB.score}
                </p>
                <p className="match-score">
                  Match Score: Team A {gameState.teamA.gamesWon + (showNotification.winner === 'A' ? 1 : 0)} - {gameState.teamB.gamesWon + (showNotification.winner === 'B' ? 1 : 0)} Team B
                </p>
                <button className="continue-button" onClick={handleContinue}>
                  {gameState.currentGame < 3 ? 'Start Next Game' : 'Continue'}
                </button>
              </>
            )}
            {showNotification.type === 'break' && (
              <>
                <h2>⏸️ Break Time</h2>
                <p>{showNotification.message}</p>
                <button className="continue-button" onClick={handleContinue}>
                  Continue
                </button>
              </>
            )}
            {showNotification.type === 'end-change' && (
              <>
                <h2>🔄 Change Ends</h2>
                <p>Players change ends (Game 3 at 8 points)</p>
                <button className="continue-button" onClick={handleContinue}>
                  Continue
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Match Won Screen */}
      {gameState.matchWon && (
        <div className="match-won-overlay">
          <div className="match-won-box">
            <h1>🏆 MATCH WON! 🏆</h1>
            <h2>Team {gameState.matchWinner} Wins!</h2>
            <p className="final-match-score">
              Final Match Score: Team A {gameState.teamA.gamesWon} - {gameState.teamB.gamesWon} Team B
            </p>
            <div className="match-won-players">
              <p><strong>Winners:</strong> {gameState[`team${gameState.matchWinner}`].players.join(' & ')}</p>
            </div>
            <button className="new-match-button" onClick={onResetGame}>
              New Match
            </button>
          </div>
        </div>
      )}

      <div className="match-header">
        <h1>🏸 Badminton Match</h1>
        <button className="reset-button" onClick={onResetGame}>
          New Match
        </button>
      </div>

      {/* Game Status Bar */}
      <div className="game-status-bar">
        <div className="game-number">Game {gameState.currentGame} of 3</div>
        <div className="game-state-label">{getGameStateLabel()}</div>
        <div className="match-score-display">
          Match: {gameState.teamA.gamesWon} - {gameState.teamB.gamesWon}
        </div>
      </div>

      {/* Scoreboard */}
      <div className="scoreboard">
        <div className="team-score team-a">
          <div className="games-won">{gameState.teamA.gamesWon} games</div>
          <div className="team-name">Team A</div>
          <div className="team-players">
            {gameState.teamA.players.join(' & ')}
          </div>
          <div className="score">{gameState.teamA.score}</div>
          {gameState.servingTeam === 'A' && (
            <div className="serving-indicator">● Serving</div>
          )}
        </div>

        <div className="vs-divider">VS</div>

        <div className="team-score team-b">
          <div className="games-won">{gameState.teamB.gamesWon} games</div>
          <div className="team-name">Team B</div>
          <div className="team-players">
            {gameState.teamB.players.join(' & ')}
          </div>
          <div className="score">{gameState.teamB.score}</div>
          {gameState.servingTeam === 'B' && (
            <div className="serving-indicator">● Serving</div>
          )}
        </div>
      </div>

      {/* Court Visualization */}
      <Court 
        positions={gameState.positions}
        currentServer={currentServer}
        servingTeam={gameState.servingTeam}
      />

      {/* Score Buttons */}
      <div className="score-controls">
        <button 
          className="score-button team-a-button"
          onClick={() => onScorePoint('A')}
          disabled={gameWonStatus.won || gameState.matchWon}
        >
          Team A Scores
        </button>
        <button 
          className="score-button team-b-button"
          onClick={() => onScorePoint('B')}
          disabled={gameWonStatus.won || gameState.matchWon}
        >
          Team B Scores
        </button>
      </div>

      {/* Game Info */}
      <div className="game-info">
        <div className="info-item">
          <strong>Current Server:</strong> {currentServer || 'N/A'}
        </div>
        <div className="info-item">
          <strong>Score Type:</strong>{' '}
          {gameState.servingTeam && (
            gameState[`team${gameState.servingTeam}`].score % 2 === 0 
              ? 'Even (serve from RIGHT)'
              : 'Odd (serve from LEFT)'
          )}
        </div>
      </div>
    </div>
  )
}
