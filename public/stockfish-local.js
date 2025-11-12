// Local Stockfish worker
// Requires you to place a compiled Stockfish script in /public/engine/stockfish.js or /public/engine/stockfish.wasm.js
// Download from https://github.com/lichess-org/stockfish.js (build locally) or obtain a prebuilt wasm
// Falls back to emitting bestmove (none) if not found so UI can detect failure.

(function(){
  let loaded = false
  try {
    importScripts('/engine/stockfish.js')
    loaded = true
  } catch {
    try {
      importScripts('/engine/stockfish.wasm.js')
      loaded = true
    } catch {}
  }

  if (!loaded) {
    self.onmessage = function(msg){
      const d = msg.data
      if (d === 'uci') postMessage('uciok')
      else if (d === 'isready') postMessage('readyok')
      else if (typeof d === 'string' && d.startsWith('go')) postMessage('bestmove (none)')
    }
    return
  }

  let engine = null
  if (typeof Stockfish === 'function') engine = Stockfish()
  else if (self && self.Stockfish) engine = self.Stockfish()

  if (!engine) {
    self.onmessage = function(msg){
      const d = msg.data
      if (d === 'uci') postMessage('uciok')
      else if (d === 'isready') postMessage('readyok')
      else if (typeof d === 'string' && d.startsWith('go')) postMessage('bestmove (none)')
    }
    return
  }

  engine.onmessage = function(line){
    try {
      const text = typeof line === 'string' ? line : (line && line.data ? line.data : '')
      if (text) postMessage(text)
    } catch {}
  }

  self.onmessage = function(e){
    try { engine.postMessage(e.data) } catch {}
  }
})();
