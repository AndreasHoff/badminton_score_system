import { useState } from 'react'
import './App.css'

// Phase 2 will replace this with SetupScreen and MatchScreen
function App() {
  const [screen, setScreen] = useState('setup') // 'setup' | 'match'

  return (
    <div className="app">
      <h1>🏸 Badminton Score System</h1>
      <p>Phase 1 complete — ready for Phase 2</p>
    </div>
  )
}

export default App
