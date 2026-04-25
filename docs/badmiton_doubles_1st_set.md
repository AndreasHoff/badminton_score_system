🏸 Badminton Doubles — Full Game Flow (1st Set)
🧭 1. Pre-Match Setup (Before the First Rally)
1.1 Coin Toss
A coin is flipped (or shuttle is tossed)
The winning side chooses ONE of:
Serve first
Receive first
Choose side of the court
1.2 Opponent Decision
The losing side chooses the remaining option:
If winners choose serve → opponents choose side
If winners choose side → opponents choose serve/receive

👉 This is critical for your UI:

You need two decisions
Who serves first
Which side each team starts on
1.3 Player Positioning (Doubles)

Each team has:

2 players
1 on left side
1 on right side

At 0–0 (even score):

Server must stand in right service court
Receiver stands diagonally opposite
🧠 Visual Mapping (IMPORTANT for your app)

At match start:

4 players visible
Each player has:
Team (A/B)
Side (left/right)
Role (server/receiver)

👉 Your UI should reflect:

Diagonal serve relationship
Left/right positioning
Who is active
🎮 2. Start of the Game (0–0)
2.1 First Serve
Score = 0–0 (even)
Server serves from right side
Serve goes diagonally to receiver
🔁 3. Core Game Loop (This is your STATE MACHINE)

Every rally results in one of two outcomes:

CASE A — Serving Team Wins the Rally
What happens:
Serving team scores +1 point
SAME player continues serving
Serving team switches sides (left ↔ right)
Receiving team does NOT move
Key Rule:

Serving team rotates when they score

UI Effect:
Score increases
Server stays same player
That player moves to opposite side
Partner swaps side too
Visual court flips for that team
CASE B — Receiving Team Wins the Rally
What happens:
Receiving team scores +1 point
They gain the serve
NO ONE changes position
The player already standing in the correct service court becomes server
Key Rule:

No rotation when serve changes hands

UI Effect:
Score increases
Serve switches team
No movement on court
Highlight new server based on position
🔢 4. Even / Odd Rule (CRITICAL LOGIC)

This rule drives everything:

Even Score (0, 2, 4, …)
Serve from right side
Odd Score (1, 3, 5, …)
Serve from left side
Important consequence:

👉 The server is determined by position + score, NOT by choice

🧩 5. Serving Logic (Who Actually Serves)

At any moment:

Look at team score
Check:
Even → right player serves
Odd → left player serves

👉 That’s it.

🔄 6. Position Behavior Summary (VERY IMPORTANT)
Situation	Serving Team	Receiving Team
Serving team scores	Switch sides	Stay
Receiving team scores	Stay	Stay
Serve changes team	Stay	Stay
🎯 7. Rally Mechanics (During Play)

After serve:

Entire court is active
Players can move freely
Positions only matter again at next serve
⏱️ 8. Mid-Game Break
First team to reach 11 points
60-second break

👉 No positional changes due to break

🏁 9. End of First Set

Game ends when:

A team reaches 21 points
AND leads by at least 2 points

OR

Score reaches 30 (cap) → next point wins
🔁 10. What Happens After Set 1

(Not for MVP yet, but for completeness)

Teams switch sides
Winner of set chooses:
who serves
OR side
🧠 The Real Insight (for your app)

Everything reduces to:

state = {
  scoreA,
  scoreB,
  servingTeam,
  playerPositions,
}

And the ONLY transitions are:

if (servingTeamWins) {
  score++
  swapPositions(servingTeam)
} else {
  score++
  servingTeam = otherTeam
}

👉 That’s your entire engine.