# Chess Board with Stockfish AI

## Setup Instructions

To enable the Stockfish AI chess engine, you need to add the Stockfish JavaScript file:

### Option 1: Download Stockfish.js
1. Download stockfish.js from: https://github.com/lichess-org/stockfish.js
2. Place `stockfish.js` and `stockfish.wasm` in the `/public` folder

### Option 2: Use CDN (Temporary Solution)
Create `/public/stockfish.js` with:
```javascript
importScripts('https://cdn.jsdelivr.net/npm/stockfish@16.0.0/src/stockfish.js')
```

## Features
- Play against Stockfish AI
- 3 difficulty levels (Easy, Medium, Hard)
- Choose your color (White or Black)
- Move history tracking
- Game status indicators
- Beautiful glassmorphism UI

## Usage
Visit `/play` to start playing chess!
