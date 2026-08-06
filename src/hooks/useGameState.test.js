import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameState } from './useGameState'

describe('useGameState - 3×15 Scoring System', () => {
  let result

  beforeEach(() => {
    const { result: hookResult } = renderHook(() => useGameState())
    result = hookResult
  })

  describe('Game Initialization', () => {
    it('should initialize with correct starting state', () => {
      expect(result.current.gameState.gameStarted).toBe(false)
      expect(result.current.gameState.currentGame).toBe(0)
      expect(result.current.gameState.matchWon).toBe(false)
    })

    it('should start game with players and serving team', () => {
      act(() => {
        result.current.startGame(
          ['Player A1', 'Player A2'],
          ['Player B1', 'Player B2'],
          'A'
        )
      })

      expect(result.current.gameState.gameStarted).toBe(true)
      expect(result.current.gameState.currentGame).toBe(1)
      expect(result.current.gameState.servingTeam).toBe('A')
      expect(result.current.gameState.teamA.score).toBe(0)
      expect(result.current.gameState.teamB.score).toBe(0)
    })
  })

  describe('Basic Scoring', () => {
    beforeEach(() => {
      act(() => {
        result.current.startGame(
          ['A1', 'A2'],
          ['B1', 'B2'],
          'A'
        )
      })
    })

    it('should increment score when serving team scores', () => {
      act(() => {
        result.current.scorePoint('A')
      })

      expect(result.current.gameState.teamA.score).toBe(1)
      expect(result.current.gameState.servingTeam).toBe('A')
    })

    it('should change serve when receiving team scores', () => {
      act(() => {
        result.current.scorePoint('B')
      })

      expect(result.current.gameState.teamB.score).toBe(1)
      expect(result.current.gameState.servingTeam).toBe('B')
    })

    it('should rotate serving team positions when they score', () => {
      const initialLeft = result.current.gameState.positions.teamA.left
      const initialRight = result.current.gameState.positions.teamA.right

      act(() => {
        result.current.scorePoint('A')
      })

      expect(result.current.gameState.positions.teamA.left).toBe(initialRight)
      expect(result.current.gameState.positions.teamA.right).toBe(initialLeft)
    })

    it('should not rotate positions when serve changes', () => {
      const initialLeftA = result.current.gameState.positions.teamA.left
      const initialLeftB = result.current.gameState.positions.teamB.left

      act(() => {
        result.current.scorePoint('B')
      })

      expect(result.current.gameState.positions.teamA.left).toBe(initialLeftA)
      expect(result.current.gameState.positions.teamB.left).toBe(initialLeftB)
    })
  })

  describe('Win Conditions', () => {
    beforeEach(() => {
      act(() => {
        result.current.startGame(['A1', 'A2'], ['B1', 'B2'], 'A')
      })
    })

    it('should detect regular win at 15 points', () => {
      // Score to 15:10
      act(() => {
        for (let i = 0; i < 15; i++) result.current.scorePoint('A')
        for (let i = 0; i < 10; i++) result.current.scorePoint('B')
      })

      const winStatus = result.current.checkGameWon()
      expect(winStatus.won).toBe(true)
      expect(winStatus.winner).toBe('A')
    })

    it('should not win at 15:14 (needs 2-point lead)', () => {
      act(() => {
        for (let i = 0; i < 15; i++) result.current.scorePoint('A')
        for (let i = 0; i < 14; i++) result.current.scorePoint('B')
      })

      const winStatus = result.current.checkGameWon()
      expect(winStatus.won).toBe(false)
    })

    it('should detect extension win at 16:14', () => {
      act(() => {
        for (let i = 0; i < 16; i++) result.current.scorePoint('A')
        for (let i = 0; i < 14; i++) result.current.scorePoint('B')
      })

      const winStatus = result.current.checkGameWon()
      expect(winStatus.won).toBe(true)
      expect(winStatus.winner).toBe('A')
    })

    it('should detect sudden death win at 21:20', () => {
      act(() => {
        for (let i = 0; i < 21; i++) result.current.scorePoint('A')
        for (let i = 0; i < 20; i++) result.current.scorePoint('B')
      })

      const winStatus = result.current.checkGameWon()
      expect(winStatus.won).toBe(true)
      expect(winStatus.winner).toBe('A')
    })
  })

  describe('Game States', () => {
    beforeEach(() => {
      act(() => {
        result.current.startGame(['A1', 'A2'], ['B1', 'B2'], 'A')
      })
    })

    it('should be in normal state at start', () => {
      expect(result.current.getGameState()).toBe('normal')
    })

    it('should enter extension at 14:14', () => {
      act(() => {
        for (let i = 0; i < 14; i++) result.current.scorePoint('A')
        for (let i = 0; i < 14; i++) result.current.scorePoint('B')
      })

      expect(result.current.getGameState()).toBe('extension')
    })

    it('should enter sudden death at 20:20', () => {
      act(() => {
        for (let i = 0; i < 20; i++) result.current.scorePoint('A')
        for (let i = 0; i < 20; i++) result.current.scorePoint('B')
      })

      expect(result.current.getGameState()).toBe('sudden-death')
    })
  })

  describe('Break at 8 Points', () => {
    beforeEach(() => {
      act(() => {
        result.current.startGame(['A1', 'A2'], ['B1', 'B2'], 'A')
      })
    })

    it('should trigger break when reaching 8 points', () => {
      act(() => {
        for (let i = 0; i < 8; i++) result.current.scorePoint('A')
      })

      expect(result.current.shouldShowBreak()).toBe(false) // Already marked
      expect(result.current.gameState.breakAt8Shown).toBe(true)
    })

    it('should not trigger break again after shown', () => {
      act(() => {
        for (let i = 0; i < 8; i++) result.current.scorePoint('A')
        result.current.scorePoint('A') // 9th point
      })

      expect(result.current.shouldShowBreak()).toBe(false)
    })
  })

  describe('Match Progression', () => {
    beforeEach(() => {
      act(() => {
        result.current.startGame(['A1', 'A2'], ['B1', 'B2'], 'A')
      })
    })

    it('should progress to game 2 after game 1 win', () => {
      // Team A wins game 1 (15:10)
      act(() => {
        for (let i = 0; i < 15; i++) result.current.scorePoint('A')
        for (let i = 0; i < 10; i++) result.current.scorePoint('B')
        result.current.startNextGame('A')
      })

      expect(result.current.gameState.currentGame).toBe(2)
      expect(result.current.gameState.teamA.gamesWon).toBe(1)
      expect(result.current.gameState.teamA.score).toBe(0)
      expect(result.current.gameState.teamB.score).toBe(0)
    })

    it('should detect match win at 2 games', () => {
      // Team A wins game 1
      act(() => {
        for (let i = 0; i < 15; i++) result.current.scorePoint('A')
        result.current.startNextGame('A')
      })

      // Team A wins game 2
      act(() => {
        for (let i = 0; i < 15; i++) result.current.scorePoint('A')
        result.current.startNextGame('A')
      })

      expect(result.current.gameState.matchWon).toBe(true)
      expect(result.current.gameState.matchWinner).toBe('A')
      expect(result.current.gameState.teamA.gamesWon).toBe(2)
    })

    it('should reset positions for new game', () => {
      const initialPosA = result.current.gameState.positions.teamA.left

      // Win game 1 with some rotations
      act(() => {
        for (let i = 0; i < 15; i++) result.current.scorePoint('A')
        result.current.startNextGame('A')
      })

      // Positions should be back to initial
      expect(result.current.gameState.positions.teamA.left).toBe(initialPosA)
    })
  })

  describe('End Change in Game 3', () => {
    beforeEach(() => {
      act(() => {
        result.current.startGame(['A1', 'A2'], ['B1', 'B2'], 'A')
        // Simulate getting to game 3
        for (let i = 0; i < 15; i++) result.current.scorePoint('A')
        result.current.startNextGame('A')
        for (let i = 0; i < 15; i++) result.current.scorePoint('B')
        result.current.startNextGame('B')
      })
    })

    it('should trigger end change at 8 points in game 3', () => {
      expect(result.current.gameState.currentGame).toBe(3)

      act(() => {
        for (let i = 0; i < 8; i++) result.current.scorePoint('A')
      })

      expect(result.current.gameState.endChangeAt8Done).toBe(true)
    })

    it('should not trigger end change in game 1 or 2', () => {
      act(() => {
        result.current.resetGame()
        result.current.startGame(['A1', 'A2'], ['B1', 'B2'], 'A')
        for (let i = 0; i < 8; i++) result.current.scorePoint('A')
      })

      expect(result.current.shouldChangeEnds()).toBe(false)
    })
  })

  describe('Current Server', () => {
    beforeEach(() => {
      act(() => {
        result.current.startGame(['A1', 'A2'], ['B1', 'B2'], 'A')
      })
    })

    it('should return right player on even score', () => {
      const server = result.current.getCurrentServer()
      expect(server).toBe('A2') // Right player (index 1)
    })

    it('should return left player on odd score', () => {
      act(() => {
        result.current.scorePoint('A') // Score 1:0 (serving team rotates)
      })

      const server = result.current.getCurrentServer()
      // After rotation: left=A2, right=A1, odd score (1) = serve from left
      expect(server).toBe('A2')
    })
  })
})
