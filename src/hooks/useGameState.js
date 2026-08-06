import { useState } from 'react'

/**
 * Core game state hook for badminton doubles scoring
 * Implements BWF 3×15 scoring system (2026) and full rotation logic
 */
export function useGameState() {
  const [gameState, setGameState] = useState({
    teamA: { players: [], score: 0, gamesWon: 0 },
    teamB: { players: [], score: 0, gamesWon: 0 },
    servingTeam: null, // 'A' or 'B'
    // Player positions: { team: 'A'|'B', side: 'left'|'right', name: string }
    positions: {
      teamA: { left: null, right: null },
      teamB: { left: null, right: null },
    },
    initialPositions: null, // Store starting positions for new games
    initialServingTeam: null, // Store who served first
    currentGame: 0, // 1, 2, or 3
    gameStarted: false,
    matchWon: false,
    matchWinner: null,
    breakAt8Shown: false, // Track if break notification shown this game
    endChangeAt8Done: false, // Track if end change done in game 3
  })

  /**
   * Initialize game with player names and starting positions
   */
  const startGame = (teamAPlayers, teamBPlayers, servingTeam) => {
    const initialPos = {
      teamA: {
        left: teamAPlayers[0],
        right: teamAPlayers[1],
      },
      teamB: {
        left: teamBPlayers[0],
        right: teamBPlayers[1],
      },
    }

    setGameState({
      teamA: { players: teamAPlayers, score: 0, gamesWon: 0 },
      teamB: { players: teamBPlayers, score: 0, gamesWon: 0 },
      servingTeam,
      positions: { ...initialPos },
      initialPositions: initialPos,
      initialServingTeam: servingTeam,
      currentGame: 1,
      gameStarted: true,
      matchWon: false,
      matchWinner: null,
      breakAt8Shown: false,
      endChangeAt8Done: false,
    })
  }

  /**
   * Get game state (normal, extension, or sudden death)
   */
  const getGameState = () => {
    const scoreA = gameState.teamA.score
    const scoreB = gameState.teamB.score

    if (scoreA === 20 && scoreB === 20) {
      return 'sudden-death' // Next point wins
    }
    if (scoreA >= 14 && scoreB >= 14) {
      return 'extension' // Deuce - need 2-point lead
    }
    return 'normal' // Play to 15
  }

  /**
   * Check if current game is won
   * Returns: { won: boolean, winner: 'A'|'B'|null }
   */
  const checkGameWon = () => {
    const scoreA = gameState.teamA.score
    const scoreB = gameState.teamB.score
    const lead = Math.abs(scoreA - scoreB)

    // Sudden death: First to 21 at 20:20
    if (scoreA === 21) return { won: true, winner: 'A' }
    if (scoreB === 21) return { won: true, winner: 'B' }

    // Normal win: First to 15 with 2-point lead
    if (scoreA >= 15 && lead >= 2) return { won: true, winner: 'A' }
    if (scoreB >= 15 && lead >= 2) return { won: true, winner: 'B' }

    return { won: false, winner: null }
  }

  /**
   * Check if break at 8 should be shown
   */
  const shouldShowBreak = () => {
    const scoreA = gameState.teamA.score
    const scoreB = gameState.teamB.score
    return !gameState.breakAt8Shown && (scoreA === 8 || scoreB === 8)
  }

  /**
   * Check if end change should happen (game 3 only)
   */
  const shouldChangeEnds = () => {
    const scoreA = gameState.teamA.score
    const scoreB = gameState.teamB.score
    return gameState.currentGame === 3 && !gameState.endChangeAt8Done && (scoreA === 8 || scoreB === 8)
  }

  /**
   * Start next game after current game ends
   */
  const startNextGame = (gameWinner) => {
    setGameState(prevState => {
      const newGamesWon = {
        A: prevState.teamA.gamesWon + (gameWinner === 'A' ? 1 : 0),
        B: prevState.teamB.gamesWon + (gameWinner === 'B' ? 1 : 0),
      }

      // Check if match is won (best of 3)
      const matchWon = newGamesWon.A === 2 || newGamesWon.B === 2
      const matchWinner = newGamesWon.A === 2 ? 'A' : newGamesWon.B === 2 ? 'B' : null

      if (matchWon) {
        return {
          ...prevState,
          teamA: { ...prevState.teamA, gamesWon: newGamesWon.A },
          teamB: { ...prevState.teamB, gamesWon: newGamesWon.B },
          matchWon: true,
          matchWinner,
        }
      }

      // Start next game - reset positions to initial
      return {
        ...prevState,
        teamA: { ...prevState.teamA, score: 0, gamesWon: newGamesWon.A },
        teamB: { ...prevState.teamB, score: 0, gamesWon: newGamesWon.B },
        servingTeam: prevState.initialServingTeam,
        positions: { ...prevState.initialPositions },
        currentGame: prevState.currentGame + 1,
        breakAt8Shown: false,
        endChangeAt8Done: false,
      }
    })
  }

  /**
   * Get current server based on serving team and score (even/odd rule)
   * Even score (0,2,4...) -> right player serves
   * Odd score (1,3,5...) -> left player serves
   */
  const getCurrentServer = () => {
    if (!gameState.servingTeam) return null

    const team = gameState.servingTeam === 'A' ? gameState.teamA : gameState.teamB
    const positions = gameState.positions[`team${gameState.servingTeam}`]
    
    // Even score = right side, Odd score = left side
    const isEvenScore = team.score % 2 === 0
    return isEvenScore ? positions.right : positions.left
  }

  /**
   * Handle scoring - implements rotation logic
   * 
   * CASE A: Serving team scores
   *   - Serving team +1 point
   *   - Serving team switches sides (rotate)
   *   - Receiving team stays
   *   - Same player continues serving (but from opposite side)
   * 
   * CASE B: Receiving team scores
   *   - Receiving team +1 point
   *   - Receiving team gains serve
   *   - NO ONE changes position
   */
  const scorePoint = (scoringTeam) => {
    setGameState(prevState => {
      const newState = { ...prevState }
      const servingTeam = prevState.servingTeam
      const isServingTeamScoring = scoringTeam === servingTeam

      if (isServingTeamScoring) {
        // CASE A: Serving team scores
        // Increment score
        newState[`team${scoringTeam}`] = {
          ...prevState[`team${scoringTeam}`],
          score: prevState[`team${scoringTeam}`].score + 1,
        }
        
        // Rotate serving team positions (switch left/right)
        const servingPositions = prevState.positions[`team${scoringTeam}`]
        newState.positions = {
          ...prevState.positions,
          [`team${scoringTeam}`]: {
            left: servingPositions.right,
            right: servingPositions.left,
          },
        }
        // Serving team stays the same
        
      } else {
        // CASE B: Receiving team scores (gain serve)
        // Increment score
        newState[`team${scoringTeam}`] = {
          ...prevState[`team${scoringTeam}`],
          score: prevState[`team${scoringTeam}`].score + 1,
        }
        
        // Change serving team, NO position changes
        newState.servingTeam = scoringTeam
      }

      // Check and mark break/end change notifications
      const newScoreA = newState.teamA.score
      const newScoreB = newState.teamB.score

      if (!prevState.breakAt8Shown && (newScoreA === 8 || newScoreB === 8)) {
        newState.breakAt8Shown = true
      }

      if (prevState.currentGame === 3 && !prevState.endChangeAt8Done && (newScoreA === 8 || newScoreB === 8)) {
        newState.endChangeAt8Done = true
      }

      return newState
    })
  }

  const resetGame = () => {
    setGameState({
      teamA: { players: [], score: 0, gamesWon: 0 },
      teamB: { players: [], score: 0, gamesWon: 0 },
      servingTeam: null,
      positions: {
        teamA: { left: null, right: null },
        teamB: { left: null, right: null },
      },
      initialPositions: null,
      initialServingTeam: null,
      currentGame: 0,
      gameStarted: false,
      matchWon: false,
      matchWinner: null,
      breakAt8Shown: false,
      endChangeAt8Done: false,
    })
  }

  return {
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
  }
}
