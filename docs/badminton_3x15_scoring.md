# 🏸 Badminton 3×15 Scoring System (BWF 2026)

**Effective:** September 2026 (Denmark and other BWF regions)

---

## 🎯 Overview

The new **3×15 scoring system** replaces the traditional 21-point system. The match format remains "best of three," but individual games are shorter and more dynamic.

---

## 📊 Core Scoring Rules

### Game Length
- Standard win: **15 points**
- Extension starts at: **14:14**
- Maximum points: **21** (sudden death at 20:20)

### Extension Rules
When the score reaches **14:14**:
- A **2-point lead** is required to win
- Game continues until one side achieves the lead or reaches 21 points

### Sudden Death
At **20:20**:
- The **next rally decides the game**
- Winner of that rally wins the game at 21:20

### Possible Game Scores
- Regular: 15:0, 15:10, 15:13, etc.
- Extension: 16:14, 17:15, 18:16, 19:17, 20:18
- Sudden death: 21:20

---

## 🔄 Match Format

- **Best of 3 games**
- First side to win **2 games** wins the match
- Possible match scores: 2-0 or 2-1

---

## ⏸️ Breaks and Intervals

### Mid-Game Break
- Occurs when a side **first reaches 8 points**
- Duration: **1 minute**

### End Change (3rd Game Only)
- Players **change ends** when a side first reaches 8 points
- Applies only in the deciding third game

### Between Games
- Break between games as per standard BWF rules

---

## 🎮 Game States

### 1. Normal Play (0:0 → 13:X or X:13)
- Play to 15 points
- First to 15 wins (if opponent has ≤13 points)

### 2. Extension (14:14 → 20:19)
- Triggered at 14:14
- Requires 2-point lead to win
- Ends when: 
  - One side achieves 2-point lead, OR
  - Score reaches 20:20

### 3. Sudden Death (20:20)
- Next rally wins the game
- Final score: 21:20

---

## 📈 Comparison with Previous System

| Aspect | Old (21-point) | New (3×15) |
|--------|----------------|------------|
| Win point | 21 | 15 |
| Extension starts | 20:20 | 14:14 |
| Max points | 30 | 21 |
| Sudden death | 29:29 → 30:29 | 20:20 → 21:20 |
| Mid-game break | 11 points | 8 points |
| End change (game 3) | 11 points | 8 points |

---

## 🔧 Implementation Notes

### Win Condition Check
```
if (score >= 15 && lead >= 2) → WIN
if (score >= 21) → WIN (sudden death)
```

### Extension Detection
```
if (scoreA >= 14 && scoreB >= 14) → EXTENSION
```

### Break Notification
```
if (scoreA == 8 || scoreB == 8) → BREAK
```

### End Change (Game 3)
```
if (gameNumber == 3 && (scoreA == 8 || scoreB == 8)) → CHANGE ENDS
```

---

## ✅ Rally Point System (Unchanged)

- Every rally counts as a point
- Winning side scores, regardless of who served
- Doubles rotation rules remain the same

---
