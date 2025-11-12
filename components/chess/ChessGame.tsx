"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Chessboard as ChessboardComponent } from "react-chessboard"
import { Chess, Square } from "chess.js"
// Dynamic import of stockfish done inside useEffect to avoid SSR resolution issues

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Chessboard = ChessboardComponent as any
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RotateCcw, Brain, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Difficulty = "easy" | "medium" | "hard"
type PlayerColor = "white" | "black"

export function ChessGame() {
  const [game, setGame] = useState(new Chess())
  const [isThinking, setIsThinking] = useState(false)
  const [engineReady, setEngineReady] = useState(false)
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [playerColor, setPlayerColor] = useState<PlayerColor>("white")
  const [gameStatus, setGameStatus] = useState<string>("Your turn")
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [moveFrom, setMoveFrom] = useState<Square | null>(null)
  const [optionSquares, setOptionSquares] = useState<Record<string, { background: string }>>({})
  const [rightClickedSquares, setRightClickedSquares] = useState<Record<string, { backgroundColor: string }>>({})
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null)
  const [engineSource, setEngineSource] = useState<"cdn" | "local">("cdn")
  const engineRetryRef = useRef(0)
  // Engine analysis state
  const [evalCpWhite, setEvalCpWhite] = useState<number | null>(null)
  const [mateIn, setMateIn] = useState<number | null>(null)
  const [pvSan, setPvSan] = useState<string[]>([])
  const [searchDepth, setSearchDepth] = useState<number | null>(null)
  // Promotion dialog state
  const [promotionOpen, setPromotionOpen] = useState(false)
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null)
  type EngineMessage = string | { data: string }
  type EngineLike = { postMessage: (cmd: string) => void; onmessage: (e: EngineMessage) => void; terminate?: () => void }
  const stockfishRef = useRef<EngineLike | null>(null)
  const gameRef = useRef<Chess>(game)
  const difficultyRef = useRef<Difficulty>("medium")
  const playerColorRef = useRef<PlayerColor>("white")
  const makeStockfishMoveRef = useRef<(m: string) => void>(() => {})
  const fallbackAIMoveRef = useRef<() => void>(() => {})
  const requestStockfishMoveRef = useRef<() => void>(() => {})
  useEffect(() => {
    gameRef.current = game
  }, [game])
  useEffect(() => { difficultyRef.current = difficulty }, [difficulty])
  useEffect(() => { playerColorRef.current = playerColor }, [playerColor])
  const moveAudioRef = useRef<HTMLAudioElement | null>(null)
  const captureAudioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio effects
  useEffect(() => {
    moveAudioRef.current = new Audio('data:audio/wav;base64,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')
    captureAudioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTOH0fPTgjMGHm7A7+OZUQ8PUKTY8bViHAU8kdry0H4yBSZ5yfDflUQLFlm16OqnVBMKRaDe8r9xIgU0iNPy1oU0Bx1uxO7nmVIPD1Cn2PKzYhwGPJLZ8s9+MgUmesrw3pZFCxZat+jqp1QTCkWh3vK/cSIFNIjU8teFNQcdccTu5ppTDg9Rp9jxs2IcBjyT2vLPfjIFJnrK8N6WRQsWWrjn6qdUEwpFod7yv3EiBTSI1PLXhTUHHXHF7uaaUw4PUajY8bNhHAY8k9ryz34zBSZ6y/DekkULFlq45+qnUxMKRaHe8sFxIgU0iNTy14U1Bx1xxe7nmlMOD1Go2PGzYRwGPJPa8s9+MwUme8vw3pJFCxZauObqp1MTCkWh3vKvcSIFNIjU8teFNQcdccbu55pTDg9RqNjxs2EcBjyT2vLPfjMFJnvL8N6SRQsWWrjm6qdTEwpFod7yoHEiBTSI1PLXhTUHHXHG7uebUw4PUajY8bNhHAY8k9ryz34zBSZ7y/DeklQLFlq45uqnUxMKRaHe8qBxIgU0iNTy14U1Bx1xxu7nm1MOD1Go2PGzYRwGPJPa8s9+MwUme8vw3pJUCxZauObqp1MTCkWh3vKgcSIFNIjU8teFNQcdccbu55tTDg9RqNjxs2EcBjyT2vLPfjMFJnvL8N6SVAsWWrjm6qdTEwpFod7yoHEiBTSI1PLXhTUHHXHG7uebUw4PUajY8bNhHAY8k9ryz34zBSZ7y/DeklQLFlq45uqnUxMKRaHe8qBxIgU0iNTy14U1Bx1xxu7nm1MOD1Go2PGzYRwGPJPa8s9+MwUme8vw3pJUCxZauObqp1MTCkWh3vKgcSIFNIjU8teFNQcdccbu55tTDg9RqNjxs2EcBjyT2vLPfjMFJnvL8N6SVAsWWrjm6qdTEwpFod7yoHEiBTSI1PLXhTUHHXHG7uebUw4PUajY8bNhHAY8lNryz34zBSZ7y/DeklQLFlq45uqnUxMKRaHe8qBxIgU0iNTy14U1Bx1xxu7nm1MOD1Go2PGzYRwGPJPa8s9+MwUme8vw3pJUCxZauObqp1MTCkWh3vKgcSIFNIjU8teFNQcdccbu55tTDg9RqNjxs2EcBjyU2vLPfjMFJnvL8N6SVAsWWrjm6qdTEwpFod7yoHEiBTSI1PLXhTUHHXHG7uebUw4PUajY8bNhHAY8lNryz34zBSZ7y/DeklQLFlq45uqnUxMKRaHe8qBxIgU0iNTy14U1Bx1xxu7nm1MOD1Go2PGzYRwGPJTa8s9+MwUme8vw3pJUCxZauObqp1MTCkWh3vKgcSIFNIjU8teFNQcdccbu55tTDg9RqNjxs2EcBjyU2vLPfjMFJnvL8N6SVAsWWrjm6qdTEwpFod7yoHEiBTSI1PLXhTUHHXHG7uebUw4PUajY8bNhHAY8lNryz34zBSZ7y/DeklQLFlq45uqnUxMKRaHe8qBxIgU0iNTy14U1Bx1xxu7nm1MOD1Go2PGzYRwGPJTa8s9+MwUme8vw3pJUCxZauObqp1MTCkWh3vKgcSIFNIjU8teFNQcdccbu55tTDg9RqNjxs2EcBjyU2vLPfjMFJnvL8N6SVAsWWrjm6qdTEwpFod7yoHEiBTSI1PLXhTUHHXHG7uebUw4PUajY8bNhHAY8lNryz34zBSZ7y/DeklQLFlq45uqnUxMKRaHe8qBxIgU0iNTy14U1Bx1xxu7nm1MOD1Go2PGzYRwG')
  }, [])

  // Play sound effect
  const playMoveSound = useCallback((isCapture: boolean) => {
    const audio = isCapture ? captureAudioRef.current : moveAudioRef.current
    if (audio) {
      audio.currentTime = 0
      audio.volume = 0.3
      audio.play().catch(() => {}) // Ignore autoplay errors
    }
  }, [])

  // Get possible moves for a square
  const getMoveOptions = useCallback((square: Square) => {
    const moves = game.moves({ square, verbose: true })
    if (moves.length === 0) {
      setOptionSquares({})
      return false
    }

    const newSquares: Record<string, { background: string }> = {}
    moves.forEach((move) => {
      const targetPiece = game.get(move.to as Square)
      const sourcePiece = game.get(square)
      newSquares[move.to] = {
        background:
          targetPiece && sourcePiece && targetPiece.type !== sourcePiece.type
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
      }
    })
    newSquares[square] = { background: "rgba(255, 255, 0, 0.4)" }
    setOptionSquares(newSquares)
    return true
  }, [game])

  // Update game status
  const updateGameStatus = useCallback((currentGame: Chess, lastMoveWasCapture = false) => {
    // Play sound based on move type
    playMoveSound(lastMoveWasCapture)

    if (currentGame.isCheckmate()) {
      setGameStatus(currentGame.turn() === "w" ? "🏆 Black wins by checkmate!" : "🏆 White wins by checkmate!")
    } else if (currentGame.isDraw()) {
      setGameStatus("🤝 Game is a draw!")
    } else if (currentGame.isStalemate()) {
      setGameStatus("🤝 Stalemate!")
    } else if (currentGame.isCheck()) {
      setGameStatus("⚠️ Check!")
    } else if (currentGame.turn() === (playerColor === "white" ? "w" : "b")) {
      setGameStatus("Your turn")
    } else {
      setGameStatus("AI's turn")
    }
  }, [playerColor, playMoveSound])

  // Make Stockfish move
  const makeStockfishMove = useCallback((moveString: string) => {
    setGame((prevGame) => {
      const gameCopy = new Chess(prevGame.fen())
      
      try {
        const fromSquare = moveString.substring(0, 2) as Square
        const toSquare = moveString.substring(2, 4) as Square
        
        // Check if it's a capture before making the move
        const isCapture = !!gameCopy.get(toSquare)
        
        const move = gameCopy.move({
          from: fromSquare,
          to: toSquare,
          promotion: moveString.length > 4 ? (moveString[4] as "q" | "r" | "b" | "n") : undefined,
        })
        
        if (move) {
          setMoveHistory(prev => [...prev, move.san])
          setLastMove({ from: fromSquare, to: toSquare })
          updateGameStatus(gameCopy, isCapture || move.captured !== undefined)
          // Reset live analysis on engine move finalize
          setSearchDepth(null)
          setPvSan([])
        }
        return gameCopy
      } catch {
        console.error("Invalid Stockfish move")
        return prevGame
      }
    })
  }, [updateGameStatus])

  // Helper: Fallback AI move (choose a random legal move) if engine fails
  const fallbackAIMove = useCallback(() => {
    setGame(prevGame => {
      const gameCopy = new Chess(prevGame.fen())
      const legal = gameCopy.moves({ verbose: true })
      if (!legal.length) {
        // No legal moves; let status update reflect mate/stalemate
        updateGameStatus(gameCopy)
        return prevGame
      }
      const chosen = legal[Math.floor(Math.random() * legal.length)]
  const promo: "q" | "r" | "b" | "n" | undefined = (chosen.promotion ? chosen.promotion : "q") as ("q" | "r" | "b" | "n" | undefined)
  const move = gameCopy.move({ from: chosen.from as Square, to: chosen.to as Square, promotion: promo })
      if (move) {
        setMoveHistory(prev => [...prev, move.san])
        setLastMove({ from: chosen.from as Square, to: chosen.to as Square })
        updateGameStatus(gameCopy, !!move.captured)
      }
      return gameCopy
    })
    setIsThinking(false)
  }, [updateGameStatus])

  // Request Stockfish to make a move
  const requestStockfishMove = useCallback((fenOverride?: string) => {
    if (!stockfishRef.current || isThinking || !engineReady) return
    // Only ask the engine to move when it's the AI's turn
    const aiColor = (playerColorRef.current === 'white') ? 'b' : 'w'
    const turnOk = (() => {
      if (fenOverride) {
        try { return new Chess(fenOverride).turn() === aiColor } catch { return false }
      }
      return gameRef.current.turn() === aiColor
    })()
    if (!turnOk) return
    setIsThinking(true)
    setGameStatus("AI is thinking...")

  // Reset retry for this search
  engineRetryRef.current = 0

    // Choose search strategy per difficulty
    const searchCmd = (() => {
      if (difficulty === 'easy') return 'go depth 6'
      if (difficulty === 'medium') return 'go depth 12'
      // hard
      return 'go movetime 1600'
    })()

    const fenToUse = fenOverride ?? gameRef.current.fen()
    stockfishRef.current.postMessage(`position fen ${fenToUse}`)
    stockfishRef.current.postMessage(searchCmd)
  }, [difficulty, isThinking, engineReady])

  // Update function refs after definitions
  useEffect(() => { makeStockfishMoveRef.current = makeStockfishMove }, [makeStockfishMove])
  useEffect(() => { fallbackAIMoveRef.current = fallbackAIMove }, [fallbackAIMove])
  useEffect(() => { requestStockfishMoveRef.current = requestStockfishMove }, [requestStockfishMove])

  // Initialize Stockfish (UCI)
  useEffect(() => {
    const workerUrl = engineSource === 'local' ? '/stockfish.js?local=1' : '/stockfish.js'
    const engine = new Worker(workerUrl) as unknown as EngineLike
    stockfishRef.current = engine

    const send = (cmd: string) => engine.postMessage(cmd)

    engine.onmessage = (event: EngineMessage) => {
      const line: string = typeof event === "string" ? event : (event && "data" in event ? event.data : "")
      if (!line) return

      if (line.startsWith("id ") || line.startsWith("option ")) {
        return
      }

      if (line.startsWith("uciok")) {
        // Engine strength and options mapping
        const curDiff = difficultyRef.current
        const opt = (() => {
          if (curDiff === 'easy') return { skill: 2, limit: true, elo: 1100 }
          if (curDiff === 'medium') return { skill: 8, limit: true, elo: 1600 }
          return { skill: 18, limit: false, elo: 2500 }
        })()
        send(`setoption name Skill Level value ${opt.skill}`)
        send(`setoption name UCI_LimitStrength value ${opt.limit ? 'true' : 'false'}`)
        send(`setoption name UCI_Elo value ${opt.elo}`)
        send(`setoption name Threads value 1`)
        send(`setoption name Hash value 16`)
        send("isready")
        return
      }

      if (line.startsWith("readyok")) {
        setEngineReady(true)
        send("ucinewgame")
        if (playerColorRef.current === "black") {
          setTimeout(() => requestStockfishMoveRef.current(), 300)
        }
        return
      }

      // Live analysis: parse info lines for eval / pv / depth
      if (line.startsWith("info ")) {
        try {
          // depth
          const depthMatch = line.match(/\bdepth\s+(\d+)/)
          if (depthMatch) setSearchDepth(parseInt(depthMatch[1], 10))

          // score: cp or mate
          const scoreCp = line.match(/\bscore\s+cp\s+(-?\d+)/)
          const scoreMate = line.match(/\bscore\s+mate\s+(-?\d+)/)
          if (scoreMate) {
            const mate = parseInt(scoreMate[1], 10)
            // Convert to white POV: if it's black to move, flip sign
            const whiteTurn = gameRef.current.turn() === 'w'
            setMateIn(whiteTurn ? mate : -mate)
            setEvalCpWhite(null)
          } else if (scoreCp) {
            const cp = parseInt(scoreCp[1], 10)
            const whiteTurn = gameRef.current.turn() === 'w'
            // UCI score is from the side to move POV
            const cpWhite = whiteTurn ? cp : -cp
            setEvalCpWhite(cpWhite)
            setMateIn(null)
          }

          // principal variation (pv) as SAN list
          const pvIdx = line.indexOf(" pv ")
          if (pvIdx !== -1) {
            const pvUciStr = line.slice(pvIdx + 4).trim()
            if (pvUciStr.length) {
              const uciMoves = pvUciStr.split(/\s+/)
              const g = new Chess(gameRef.current.fen())
              const sanList: string[] = []
              for (const uci of uciMoves) {
                const from = uci.slice(0,2) as Square
                const to = uci.slice(2,4) as Square
                const promo = uci.length > 4 ? (uci[4] as 'q'|'r'|'b'|'n') : undefined
                const m = g.move({ from, to, promotion: promo })
                if (!m) break
                sanList.push(m.san)
              }
              setPvSan(sanList)
            }
          }
        } catch {}
        return
      }

      if (line.startsWith("bestmove")) {
        const parts = line.trim().split(/\s+/)
        const move = parts[1]
        if (!move || move === "(none)" || move === "0000") {
          // Retry once; if still none, fallback
          if (engineRetryRef.current < 1) {
            engineRetryRef.current += 1
            // Re-issue search with same params
            const searchCmd = (() => {
              const curDiff = difficultyRef.current
              if (curDiff === 'easy') return 'go depth 6'
              if (curDiff === 'medium') return 'go depth 12'
              return 'go movetime 1600'
            })()
            send(`position fen ${gameRef.current.fen()}`)
            send(searchCmd)
          } else {
            fallbackAIMoveRef.current()
          }
          return
        }
        const legalUCIMoves = new Chess(gameRef.current.fen()).moves({ verbose: true }).map(m => `${m.from}${m.to}${m.promotion ? m.promotion : ""}`)
        if (!legalUCIMoves.includes(move)) {
          // Retry once on illegal move; then fallback
          if (engineRetryRef.current < 1) {
            engineRetryRef.current += 1
            const searchCmd = (() => {
              const curDiff = difficultyRef.current
              if (curDiff === 'easy') return 'go depth 6'
              if (curDiff === 'medium') return 'go depth 12'
              return 'go movetime 1600'
            })()
            send(`position fen ${gameRef.current.fen()}`)
            send(searchCmd)
          } else {
            fallbackAIMoveRef.current()
          }
          return
        }
        makeStockfishMoveRef.current(move)
        setIsThinking(false)
        engineRetryRef.current = 0
        return
      }
    }

    // Kick off UCI
    send("uci")

    return () => {
      try {
        stockfishRef.current?.postMessage("quit")
        stockfishRef.current?.terminate?.()
      } catch {}
      setEngineReady(false)
    }
  }, [engineSource])

  // Handle square click for move selection
  const onSquareClick = (square: string) => {
    const sq = square as Square
    // Reset right-clicked squares
    setRightClickedSquares({})

    // If no square is selected, try to select this square (allow showing options even if not player's turn)
    if (!moveFrom) {
      const piece = game.get(sq)
      if (piece && piece.color === (playerColor === "white" ? "w" : "b")) {
        setMoveFrom(sq)
        getMoveOptions(sq)
      } else {
        setMoveFrom(null)
        setOptionSquares({})
      }
      return
    }

    // Check if it's player's turn before attempting a move
    const isPlayerTurn = (playerColor === "white" && game.turn() === "w") || 
                        (playerColor === "black" && game.turn() === "b")
    if (!isPlayerTurn || isThinking) {
      // keep selection but don't move
      return
    }

    // Try to make a move from the selected square to this square
    setGame((prevGame) => {
      const gameCopy = new Chess(prevGame.fen())
      
      // Check if it's a capture before making the move
      const isCapture = !!gameCopy.get(sq)
      // Handle promotion choice
      const piece = gameCopy.get(moveFrom as Square)
      const isPawn = piece?.type === 'p'
      const isPromoDest = (playerColor === 'white' && sq[1] === '8') || (playerColor === 'black' && sq[1] === '1')
      if (isPawn && isPromoDest) {
        setPendingPromotion({ from: moveFrom as Square, to: sq })
        setPromotionOpen(true)
        return prevGame
      }

      const move = gameCopy.move({
        from: moveFrom as Square,
        to: sq,
        promotion: undefined,
      })
      
      if (move === null) {
        // If move is invalid, try to select the new square instead
        const piece = gameCopy.get(sq)
        if (piece && piece.color === (playerColor === "white" ? "w" : "b")) {
          setMoveFrom(sq)
          getMoveOptions(sq)
        } else {
          setMoveFrom(null)
          setOptionSquares({})
        }
        return prevGame
      }
      
      // Valid move made
      setMoveFrom(null)
      setOptionSquares({})
      setMoveHistory(prev => [...prev, move.san])
      setLastMove({ from: moveFrom as Square, to: sq })
      updateGameStatus(gameCopy, isCapture || move.captured !== undefined)
      
      // Check if game is over
      if (!gameCopy.isGameOver()) {
        // Request AI move after a short delay
        const fenAfterMove = gameCopy.fen()
        setTimeout(() => {
          requestStockfishMove(fenAfterMove)
        }, 300)
      }
      
      return gameCopy
    })
  }

  // Handle piece drop (supports both legacy and new react-chessboard signatures)
  // react-chessboard may call onPieceDrop(sourceSquare, targetSquare, piece) OR pass a single event object
  // Narrow types for the various callback signatures used by react-chessboard
  type DropEvt = { sourceSquare?: string; targetSquare?: string; piece?: { pieceType?: string } | string; from?: string; to?: string; position?: string }
  const onDrop = (arg1: string | DropEvt, arg2?: string, arg3?: string): boolean => {
    // Normalize inputs
    let fromSquare: string | undefined
    let toSquare: string | undefined
    let pieceCode: string | undefined

    if (typeof arg1 === "string") {
      fromSquare = arg1
      toSquare = typeof arg2 === "string" ? arg2 : undefined
      pieceCode = typeof arg3 === "string" ? arg3 : undefined
    } else if (typeof arg1 === "object" && arg1 !== null) {
      // New event shape
      const evt = arg1 as DropEvt
      fromSquare = evt.sourceSquare || evt.from || evt.position || undefined
      toSquare = evt.targetSquare || evt.to || undefined
      pieceCode = typeof evt.piece === "string" ? evt.piece : evt.piece?.pieceType
    }

    if (!fromSquare || !toSquare) return false

    // Reset selection/highlights
    setMoveFrom(null)
    setOptionSquares({})
    setRightClickedSquares({})

    // Only allow actual move if it's player's turn
    const isPlayerTurn = (playerColor === "white" && game.turn() === "w") || (playerColor === "black" && game.turn() === "b")
    if (!isPlayerTurn || isThinking) return false

    let moveMade = false
    setGame(prevGame => {
      const gameCopy = new Chess(prevGame.fen())
      const isCapturePre = !!gameCopy.get(toSquare as Square)
      const isPromotion = pieceCode?.toLowerCase().includes("p") && ((playerColor === "white" && toSquare[1] === "8") || (playerColor === "black" && toSquare[1] === "1"))

      if (isPromotion) {
        // Open promotion dialog and wait for user choice
        setPendingPromotion({ from: fromSquare as Square, to: toSquare as Square })
        setPromotionOpen(true)
        moveMade = false
        return prevGame
      }

      const move = gameCopy.move({
        from: fromSquare as Square,
        to: toSquare as Square,
        promotion: undefined,
      })

      if (move === null) {
        moveMade = false
        return prevGame
      }

      moveMade = true
      setMoveHistory(prev => [...prev, move.san])
      setLastMove({ from: fromSquare as Square, to: toSquare as Square })
      updateGameStatus(gameCopy, isCapturePre || move.captured !== undefined)

      if (!gameCopy.isGameOver()) {
        const fenAfterMove = gameCopy.fen()
        setTimeout(() => requestStockfishMove(fenAfterMove), 300)
      }
      return gameCopy
    })

    return moveMade
  }

  // Apply promotion after user selects piece
  const applyPromotion = useCallback((piece: 'q'|'r'|'b'|'n') => {
    if (!pendingPromotion) return
    const { from, to } = pendingPromotion
    setPromotionOpen(false)
    setPendingPromotion(null)
    setGame(prevGame => {
      const gameCopy = new Chess(prevGame.fen())
      const isCapture = !!gameCopy.get(to)
      const move = gameCopy.move({ from, to, promotion: piece })
      if (!move) return prevGame
      setMoveFrom(null)
      setOptionSquares({})
      setRightClickedSquares({})
      setMoveHistory(prev => [...prev, move.san])
      setLastMove({ from, to })
      updateGameStatus(gameCopy, isCapture || move.captured !== undefined)
      if (!gameCopy.isGameOver()) {
        const fenAfterMove = gameCopy.fen()
        setTimeout(() => requestStockfishMove(fenAfterMove), 300)
      }
      return gameCopy
    })
  }, [pendingPromotion, requestStockfishMove, updateGameStatus])

  // Handle right-click for marking squares
  const onSquareRightClick = (square: string) => {
    const sq = square as Square
    const color = "rgba(255, 0, 0, 0.5)"
    setRightClickedSquares((prev) => {
      const newSquares = { ...prev }
      if (newSquares[sq]) {
        delete newSquares[sq]
      } else {
        newSquares[sq] = { backgroundColor: color }
      }
      return newSquares
    })
  }

  // Reset game
  const resetGame = () => {
    const newGame = new Chess()
    setGame(newGame)
    setMoveHistory([])
    setGameStatus("Your turn")
    setIsThinking(false)
    setMoveFrom(null)
    setOptionSquares({})
    setRightClickedSquares({})
    setLastMove(null)
    setEvalCpWhite(null)
    setMateIn(null)
    setPvSan([])
    setSearchDepth(null)
    setEngineReady(prev => prev) // keep state; engine remains initialized
    
    // If player chose black, let AI make first move
    if (playerColor === "black") {
      setTimeout(() => {
        requestStockfishMove()
      }, 500)
    }
  }

  // Change player color
  const handleColorChange = (color: PlayerColor) => {
    setPlayerColor(color)
    const newGame = new Chess()
    setGame(newGame)
    setMoveHistory([])
    setGameStatus("Your turn")
    setIsThinking(false)
    setMoveFrom(null)
    setOptionSquares({})
    setRightClickedSquares({})
    setLastMove(null)
    setEvalCpWhite(null)
    setMateIn(null)
    setPvSan([])
    setSearchDepth(null)
    
    // If player chose black, let AI make first move
    if (color === "black") {
      setTimeout(() => {
        requestStockfishMove()
      }, 800)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chess Board */}
        <div className="lg:col-span-2">
          <Card className="glass-strong p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Play Chess</h2>
              {isThinking && (
                <div className="flex items-center gap-2 text-amber-600">
                  <Brain className="w-5 h-5 animate-pulse" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              )}
            </div>
            
            <div className="aspect-square max-w-2xl mx-auto">
              <Chessboard
                options={{
                  position: game.fen(),
                  onPieceDrop: onDrop,
                  onSquareClick: onSquareClick,
                  onSquareRightClick: onSquareRightClick,
                  boardWidth: 600,
                  customDarkSquareStyle: { backgroundColor: "#b58863" },
                  customLightSquareStyle: { backgroundColor: "#f0d9b5" },
                  customSquareStyles: {
                    ...optionSquares,
                    ...rightClickedSquares,
                    ...(lastMove && {
                      [lastMove.from]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
                      [lastMove.to]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
                    }),
                  },
                  arePiecesDraggable: !isThinking,
                  animationDuration: 200,
                  boardOrientation: playerColor,
                }}
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-lg font-semibold text-purple-700">{gameStatus}</p>
              {game.isCheck() && !game.isCheckmate() && (
                <p className="text-sm text-red-600 mt-1 animate-pulse">King is in check!</p>
              )}
            </div>
          </Card>
        </div>

        {/* Game Controls & Info */}
        <div className="space-y-4">
          {/* Engine Analysis */}
          <Card className="glass p-6">
            <h3 className="text-xl font-bold mb-4">Engine Analysis</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-80">Depth</span>
                <span className="font-semibold">{searchDepth ?? '-'}</span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm opacity-80">Evaluation (white)</span>
                  <span className="font-semibold">
                    {mateIn !== null ? (mateIn > 0 ? `#${mateIn}` : `#${-mateIn}`) : (evalCpWhite !== null ? (evalCpWhite/100).toFixed(2) : '-')}
                  </span>
                </div>
                {/* Eval bar */}
                <div className="h-3 w-full bg-gradient-to-r from-black via-gray-300 to-white rounded-full overflow-hidden">
                  {(() => {
                    const clamp = (v:number, min:number, max:number) => Math.max(min, Math.min(max, v))
                    const score = mateIn !== null ? (mateIn > 0 ? 1 : 0) : (evalCpWhite ?? 0)
                    const pct = mateIn !== null ? (mateIn > 0 ? 1 : 0) : (0.5 + clamp(score, -400, 400) / 800)
                    const width = clamp(pct, 0, 1) * 100
                    return <div className="h-full bg-purple-500/60 transition-all" style={{ width: `${width}%` }} />
                  })()}
                </div>
              </div>
              <div>
                <div className="text-sm opacity-80 mb-1">Principal variation</div>
                <div className="font-mono text-sm break-words">
                  {pvSan.length ? pvSan.slice(0, 12).join(' ') : <span className="opacity-60">(waiting for analysis...)</span>}
                </div>
              </div>
            </div>
          </Card>
          {/* Game Settings */}
          <Card className="glass p-6">
            <h3 className="text-xl font-bold mb-4">Game Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Play as</label>
                <Select value={playerColor} onValueChange={(value) => handleColorChange(value as PlayerColor)}>
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                        White
                      </div>
                    </SelectItem>
                    <SelectItem value="black">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-black rounded"></div>
                        Black
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">AI Difficulty</label>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Engine Source</label>
                <Select value={engineSource} onValueChange={(value) => setEngineSource(value as ("cdn"|"local"))}>
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cdn">CDN (default)</SelectItem>
                    <SelectItem value="local">Local (requires /public/engine)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={resetGame} className="w-full glass" variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                New Game
              </Button>
            </div>
          </Card>

          {/* Move History */}
          <Card className="glass p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
              Move History
              <span className="text-sm font-normal opacity-60">
                {moveHistory.length} moves
              </span>
            </h3>
            <div className="max-h-64 overflow-y-auto space-y-1 scrollbar-thin">
              {moveHistory.length === 0 ? (
                <p className="text-sm opacity-60 text-center py-4">No moves yet</p>
              ) : (
                <div className="space-y-1">
                  {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, pairIndex) => {
                    const whiteMove = moveHistory[pairIndex * 2]
                    const blackMove = moveHistory[pairIndex * 2 + 1]
                    const isLatestPair = pairIndex === Math.floor(moveHistory.length / 2)
                    
                    return (
                      <div 
                        key={pairIndex} 
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                          isLatestPair ? 'bg-purple-100/50 dark:bg-purple-900/20' : ''
                        }`}
                      >
                        <span className="text-xs font-medium opacity-60 w-6">
                          {pairIndex + 1}.
                        </span>
                        <div className="flex-1 flex items-center gap-2">
                          <User className="w-3 h-3 text-blue-500 flex-shrink-0" />
                          <span className="font-mono text-sm">{whiteMove}</span>
                        </div>
                        {blackMove && (
                          <div className="flex-1 flex items-center gap-2">
                            <Brain className="w-3 h-3 text-amber-600 flex-shrink-0" />
                            <span className="font-mono text-sm">{blackMove}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </Card>

          {/* Game Stats */}
          <Card className="glass p-6">
            <h3 className="text-xl font-bold mb-4">Game Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Total Moves</span>
                <span className="font-bold text-purple-600">{moveHistory.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Captures</span>
                <span className="font-bold text-purple-600">
                  {moveHistory.filter(m => m.includes('x')).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Checks</span>
                <span className="font-bold text-purple-600">
                  {moveHistory.filter(m => m.includes('+')).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Difficulty</span>
                <span className="font-bold text-amber-600 capitalize">{difficulty}</span>
              </div>
            </div>
          </Card>

          {/* Player Info */}
          <Card className="glass p-6">
            <h3 className="text-xl font-bold mb-3">💡 How to Play</h3>
            <ul className="text-sm space-y-2 opacity-90 leading-relaxed">
              <li>• <strong>Drag & Drop</strong> pieces to move them</li>
              <li>• <strong>Click</strong> a piece to see possible moves</li>
              <li>• <strong>Right-click</strong> squares to mark them</li>
              <li>• The AI uses <strong>Stockfish</strong> engine</li>
              <li>• Yellow highlights show last move</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Promotion Dialog */}
      <Dialog open={promotionOpen} onOpenChange={(o)=> setPromotionOpen(o)}>
        <DialogContent showCloseButton={false} className="glass">
          <DialogHeader>
            <DialogTitle>Choose promotion piece</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-3 mt-2">
            {([
              { key: 'q', label: 'Queen' },
              { key: 'r', label: 'Rook' },
              { key: 'b', label: 'Bishop' },
              { key: 'n', label: 'Knight' },
            ] as const).map(opt => (
              <Button key={opt.key} onClick={() => applyPromotion(opt.key)} className="glass">
                {opt.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
