import { ChessGame } from "@/components/chess/ChessGame"

export default function PlayPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Play Chess Online</h1>
          <p className="text-lg opacity-80">
            Challenge the Stockfish AI engine and improve your skills
          </p>
        </div>
        <ChessGame />
      </div>
    </div>
  )
}
