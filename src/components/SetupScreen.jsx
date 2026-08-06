import { useState } from 'react'
import './SetupScreen.css'

export function SetupScreen({ onStartMatch }) {
  const [teamAPlayer1, setTeamAPlayer1] = useState('')
  const [teamAPlayer2, setTeamAPlayer2] = useState('')
  const [teamBPlayer1, setTeamBPlayer1] = useState('')
  const [teamBPlayer2, setTeamBPlayer2] = useState('')
  const [servingTeam, setServingTeam] = useState('A')

  const handleStartMatch = () => {
    // Validate all players have names
    if (!teamAPlayer1 || !teamAPlayer2 || !teamBPlayer1 || !teamBPlayer2) {
      alert('Please enter all player names')
      return
    }

    onStartMatch(
      [teamAPlayer1, teamAPlayer2],
      [teamBPlayer1, teamBPlayer2],
      servingTeam
    )
  }

  return (
    <div className="setup-screen">
      <h1>🏸 Badminton Doubles Setup</h1>
      
      <div className="setup-container">
        <div className="team-setup">
          <h2>Team A</h2>
          <div className="player-inputs">
            <input
              type="text"
              placeholder="Player 1 (starts left)"
              value={teamAPlayer1}
              onChange={(e) => setTeamAPlayer1(e.target.value)}
            />
            <input
              type="text"
              placeholder="Player 2 (starts right)"
              value={teamAPlayer2}
              onChange={(e) => setTeamAPlayer2(e.target.value)}
            />
          </div>
        </div>

        <div className="team-setup">
          <h2>Team B</h2>
          <div className="player-inputs">
            <input
              type="text"
              placeholder="Player 1 (starts left)"
              value={teamBPlayer1}
              onChange={(e) => setTeamBPlayer1(e.target.value)}
            />
            <input
              type="text"
              placeholder="Player 2 (starts right)"
              value={teamBPlayer2}
              onChange={(e) => setTeamBPlayer2(e.target.value)}
            />
          </div>
        </div>

        <div className="serve-selection">
          <h3>Who serves first?</h3>
          <div className="serve-options">
            <label>
              <input
                type="radio"
                name="serving"
                value="A"
                checked={servingTeam === 'A'}
                onChange={(e) => setServingTeam(e.target.value)}
              />
              Team A
            </label>
            <label>
              <input
                type="radio"
                name="serving"
                value="B"
                checked={servingTeam === 'B'}
                onChange={(e) => setServingTeam(e.target.value)}
              />
              Team B
            </label>
          </div>
        </div>

        <button className="start-button" onClick={handleStartMatch}>
          Start Match
        </button>
      </div>
    </div>
  )
}
