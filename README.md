# Badminton Scoring MVP

A simple UI for umpires to control a badminton match using the **BWF 3×15 scoring system (2026)**.

## Features
- **3×15 Scoring System**: Games to 15 points (extension at 14:14, sudden death at 20:20)
- **Best of 3 Match Format**: First to win 2 games wins the match
- **Full Doubles Rotation**: Implements proper serving and position rotation
- **Visual Court Display**: Live 4-player court with server highlighting
- **Break Notifications**: 1-minute break at 8 points
- **End Change**: Automatic end change in game 3 at 8 points

## Goals
- Fast interaction
- Clear visual state
- Minimal setup
- Compliance with new BWF rules

## Scope
- No backend
- No persistence
- Local state only

## Dev

```bash
npm install
npm run dev
```

## Scoring Rules

- Games to **15 points**
- Extension at **14:14** (need 2-point lead)
- Sudden death at **20:20** (next point wins)
- Break when first side reaches **8 points**
- Best of 3 games format
