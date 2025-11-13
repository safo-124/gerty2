"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Student { id: number; name: string | null; email: string }
interface Puzzle { id: number; title: string; fen: string; difficulty?: string | null; createdAt: string }

export function PuzzlesTab() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [fen, setFen] = useState("")
  const [solution, setSolution] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [assignTo, setAssignTo] = useState<number[]>([])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [pRes, sRes] = await Promise.all([
        fetch("/api/coach/puzzles"),
        fetch("/api/coach/students"),
      ])
      const [pData, sData] = await Promise.all([pRes.json(), sRes.json()])
      if (!pRes.ok) throw new Error(pData.error || "Failed to load puzzles")
      if (!sRes.ok) throw new Error(sData.error || "Failed to load students")
      setPuzzles(pData.puzzles)
      setStudents(sData.students)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      setError(msg)
    } finally { setLoading(false) }
  }

  useEffect(() => { void load() }, [])

  async function createPuzzle(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch("/api/coach/puzzles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, fen, solution, difficulty: difficulty || undefined, assignTo }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create puzzle")
      setTitle(""); setFen(""); setSolution(""); setDifficulty(""); setAssignTo([])
      void load()
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      setError(msg)
    }
  }

  // reserved for future display of assignees per puzzle

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="p-6 glass">
        <h2 className="font-semibold text-xl mb-4">Create Puzzle</h2>
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        <form className="space-y-3" onSubmit={createPuzzle}>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mate in 2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">FEN</label>
            <Input value={fen} onChange={(e) => setFen(e.target.value)} placeholder="FEN string" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Solution (SAN moves or PGN)</label>
            <Textarea value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="1. Qg7+ Bxg7 2. Rd8#" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Difficulty</label>
            <Input value={difficulty} onChange={(e) => setDifficulty(e.target.value)} placeholder="Beginner/Intermediate/Advanced" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Assign to (optional)</label>
            <div className="max-h-32 overflow-auto p-2 border rounded-md glass">
              {students.length === 0 ? (
                <p className="text-sm opacity-70">No students to assign.</p>
              ) : students.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-sm py-1">
                  <input type="checkbox" checked={assignTo.includes(s.id)} onChange={(e) => {
                    setAssignTo((prev) => e.target.checked ? [...prev, s.id] : prev.filter(id => id !== s.id))
                  }} />
                  <span>{s.name || s.email}</span>
                </label>
              ))}
            </div>
          </div>
          <Button type="submit">Create Puzzle</Button>
        </form>
      </Card>
      <Card className="p-6 glass">
        <h2 className="font-semibold text-xl mb-4">My Puzzles</h2>
        {loading ? (
          <p>Loading...</p>
        ) : puzzles.length === 0 ? (
          <p className="opacity-70">No puzzles created yet.</p>
        ) : (
          <div className="overflow-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {puzzles.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell title={p.fen}>{p.title}</TableCell>
                    <TableCell>{p.difficulty || "—"}</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell className="text-xs opacity-70">{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  )
}
