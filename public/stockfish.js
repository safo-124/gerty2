// Stockfish Web Worker loader (CDN by default; optional local via ?local=1)
let loaded = false
let preferLocal = false
try {
  const url = new URL(self.location.href)
  const v = url.searchParams.get('local')
  preferLocal = v === '1' || v === 'true'
} catch {}

if (preferLocal) {
  try {
    importScripts('/engine/stockfish.js')
    loaded = true
  } catch {}
  if (!loaded) {
    try {
      importScripts('/engine/stockfish.wasm.js')
      loaded = true
    } catch {}
  }
}

if (!loaded) {
  try {
    importScripts('https://unpkg.com/stockfish@17.1.0/stockfish.js')
    loaded = true
  } catch {}
}

if (!loaded) {
  try { importScripts('https://unpkg.com/stockfish@16/stockfish.js'); loaded = true } catch {}
}

let engine = null
if (typeof Stockfish === "function") {
  engine = Stockfish()
} else if (self && self.Stockfish) {
  engine = self.Stockfish()
}

if (!engine) {
  // As a last resort, emulate minimal responses to avoid crashing the app
  self.onmessage = function (e) {
    if (e.data === "uci") postMessage("uciok")
    else if (e.data === "isready") postMessage("readyok")
    else if (typeof e.data === "string" && e.data.startsWith("go")) postMessage("bestmove (none)")
  }
} else {
  engine.onmessage = function (line) {
    try {
      const text = typeof line === "string" ? line : (line && line.data ? line.data : "")
      if (text) postMessage(text)
    } catch {}
  }
  self.onmessage = function (e) {
    try {
      engine.postMessage(e.data)
    } catch {}
  }
}
