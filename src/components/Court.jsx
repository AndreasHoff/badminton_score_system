import './Court.css'

export function Court({ positions, currentServer, servingTeam }) {
  const renderPlayer = (playerName, team, side) => {
    const isServer = playerName === currentServer
    const isServingTeam = team === servingTeam
    
    return (
      <div 
        className={`player ${isServer ? 'server' : ''} ${isServingTeam ? 'serving-team' : ''}`}
      >
        <div className="player-name">{playerName}</div>
        {isServer && <div className="server-badge">🏸 SERVING</div>}
      </div>
    )
  }

  return (
    <div className="court">
      <div className="court-label">Badminton Court (Doubles)</div>
      
      {/* Team B (top) */}
      <div className="court-half team-b-side">
        <div className="team-label">Team B</div>
        <div className="court-row">
          <div className="court-position left">
            {renderPlayer(positions.teamB.left, 'B', 'left')}
          </div>
          <div className="net-divider-vertical"></div>
          <div className="court-position right">
            {renderPlayer(positions.teamB.right, 'B', 'right')}
          </div>
        </div>
      </div>

      {/* Net */}
      <div className="net">
        <div className="net-line">━━━━━━━━━━ NET ━━━━━━━━━━</div>
      </div>

      {/* Team A (bottom) */}
      <div className="court-half team-a-side">
        <div className="court-row">
          <div className="court-position left">
            {renderPlayer(positions.teamA.left, 'A', 'left')}
          </div>
          <div className="net-divider-vertical"></div>
          <div className="court-position right">
            {renderPlayer(positions.teamA.right, 'A', 'right')}
          </div>
        </div>
        <div className="team-label">Team A</div>
      </div>
    </div>
  )
}
