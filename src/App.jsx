import { useGameState } from './hooks/useGameState'
import { SetupScreen } from './components/SetupScreen'
import { MatchScreen } from './components/MatchScreen'
import './App.css'

function App() {
  const { 
    gameState, 
    startGame, 
    scorePoint, 
    resetGame, 
    getCurrentServer,
    getGameState,
    checkGameWon,
    shouldShowBreak,
    shouldChangeEnds,
    startNextGame,
  } = useGameState()

  const handleStartMatch = (teamAPlayers, teamBPlayers, servingTeam) => {
    startGame(teamAPlayers, teamBPlayers, servingTeam)
  }

  const handleResetGame = () => {
    if (window.confirm('Are you sure you want to start a new match?')) {
      resetGame()
    }
  }

  return (
    <div className="app">
      {!gameState.gameStarted ? (
        <SetupScreen onStartMatch={handleStartMatch} />
      ) : (
        <MatchScreen 
          gameState={gameState}
          onScorePoint={scorePoint}
          onResetGame={handleResetGame}
          getCurrentServer={getCurrentServer}
          getGameState={getGameState}
          checkGameWon={checkGameWon}
          shouldShowBreak={shouldShowBreak}
          shouldChangeEnds={shouldChangeEnds}
          startNextGame={startNextGame}
        />
      )}
    </div>
  )
}

export default App
