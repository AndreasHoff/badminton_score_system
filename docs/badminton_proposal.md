# badminton_proposal.md

---

# 🏸 Badminton Scoring MVP — Full Build Compass

---

## 🎯 Objective

Build a **fast, interactive MVP** for a badminton scoring system that an umpire can use during a match.

**Primary goal:**
- Validate usability
- Simulate real match flow

**Not a goal:**
- Production-ready system
- Backend architecture
- Data persistence

---

## 🧠 Core Principles

- Local state only (no backend)
- Speed over completeness
- UI-driven development
- AI writes code, you guide logic
- Iterate fast, don’t overdesign
- Focus on match simulation, not infrastructure

---

## ⚙️ Tech Stack

- React (Vite)
- Local state (`useState` / `useReducer`)
- VS Code + GitHub Copilot
- Deploy via GitHub Pages

---

## 🚀 Phase 1 — Project Setup (0–15 min)

### Initialize project

- The repo is already created and cloned from github, so this is a clean project directory.

```bash
npm create vite@latest 
npm install
```

---

## 📁 Required Project Files

### `/README.md`

```md
# Badminton Scoring MVP

A simple UI for umpires to control a badminton match.

## Goals
- Fast interaction
- Clear visual state
- Minimal setup

## Scope
- No backend
- No persistence
- Local state only
```

---

### `/docs/spec.md`

```md
# MVP Spec

## Setup Screen
- Input 4 player names
- Assign into Team A / Team B
- Button: Start Match

## Match Screen
- Show:
  - Team A vs Team B
  - Score
  - Serving team

- Buttons:
  - Team A scores
  - Team B scores

## Court Visualization
- 4 positions (doubles)
- Highlight server

## Rules (basic only)
- Scoring increments
- Server switches when receiving team wins
```

---

### `/.github/copilot-instructions.md`

```md
You are building a badminton scoring MVP.

Always:
- Read docs/badminton_proposal.md before making changes
- Read docs/badminton_doubles_1st_set.md before implementing any game logic
- Follow the phases defined in the document
- Keep implementations simple
- Use React with local state only
- Keep components small and focused
- For now this will be a MVP solution, so prioritize speed and simplicity over extensibility or edge cases
- When in doubt, refer back to the docs and implement the simplest possible solution that meets the requirements
- If still in doubt, ask for clarification or propose a simple solution and iterate from there

For now you will never:
- Add backend or database
- Overengineer or add unnecessary abstractions

Work step-by-step and explain what you are doing.
```

---

## 🧱 Phase 2 — AI-Driven Development (15–90 min)

### 🧠 Workflow

- Open project in VS Code
- Use Copilot Chat
- Do NOT manually code unless necessary
- Prompt → Review → Refine

---

### 🔹 Step 1 — Generate App Structure

```
Read docs/spec.md

Create the initial React app structure.

Include:
- Setup screen
- Match screen
- Switching between screens
```

---

### 🔹 Step 2 — Setup Screen

```
Create a SetupScreen component.

Features:
- Input for 4 player names
- Assign to Team A / Team B
- Start button initializes match state
```

---

### 🔹 Step 3 — Game State Hook

```
Create a useGameState hook.

State should include:
- players
- teams
- scoreA
- scoreB
- servingTeam
```

---

### 🔹 Step 4 — Match Screen

```
Create MatchScreen component.

Show:
- Player names
- Score
- Serving team

Include:
- Button: Team A scores
- Button: Team B scores
```

---

### 🔹 Step 5 — Court Visualization

```
Create a Court component.

Requirements:
- 4-position grid (doubles)
- Highlight serving player
- Keep it visually simple
```

---

## 🧩 Minimal Data Model

```ts
type GameState = {
  teamA: string[]
  teamB: string[]
  scoreA: number
  scoreB: number
  servingTeam: 'A' | 'B'
}
```

---

## ❌ Explicit Non-Goals

Do NOT implement:

- Backend  
- Database  
- Authentication  
- Complex badminton rules  
- Full rotation logic  
- Advanced match rules  
- External APIs  

---

## ⚡ Optional (ONLY if needed)

### Fake persistence

```ts
localStorage
```

Use only if required for demo purposes.

---

## ⏱️ Target Timeline

| Time       | Outcome                         |
|------------|---------------------------------|
| 0–30 min   | Setup + basic UI               |
| 30–60 min  | Scoring system working         |
| 60–90 min  | Court visualization            |

---

## 🧠 Development Mindset

Avoid:
"Let’s build the full system"

Focus on:
"Can I simulate a match clearly and simply?"

---

## 🚀 Definition of Done (MVP)

- Input 4 players  
- Assign teams  
- Start match  
- Increment score  
- Display serving team  
- Basic court visualization  
- Smooth interaction for umpire  

---

## 🔜 Next Phases (AFTER MVP)

- Add real badminton rules (rotation, serving side logic)  
- Improve UI/UX  
- Add persistence (localStorage → backend later)  
- Introduce GitHub issue workflow inside app  
- Refactor into scalable architecture  

---