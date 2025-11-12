Local Stockfish engine (optional)

You can bundle a local engine to run offline and avoid CDN fetches.

Place one of the following files in this folder:

- stockfish.js (WebAssembly build wrapper from lichess-org/stockfish.js)
- stockfish.wasm.js (alternate build name)

How to get the file:
- Build from source: https://github.com/lichess-org/stockfish.js
- Or download a prebuilt release and copy stockfish.js here.

Once present, the app's worker at /public/stockfish.js will load the local engine first.
