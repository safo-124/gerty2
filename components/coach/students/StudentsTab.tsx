"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Student {
  id: number
  email: string
  name: string | null
  level?: string | null
  goals?: string | null
}

export function StudentsTab() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/coach/students", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to fetch students")
      setStudents(data.students)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  return (
    <Card className="p-6 glass">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-xl">Assigned Students</h2>
        <Button variant="outline" onClick={load}>Refresh</Button>
      </div>
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : students.length === 0 ? (
        <p className="opacity-70">No students assigned yet.</p>
      ) : (
        <div className="overflow-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Goals</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell>{s.name || "—"}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.level || "—"}</TableCell>
                  <TableCell className="max-w-[250px] truncate" title={s.goals || undefined}>{s.goals || "—"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => window.location.hash = "#messages"}>Message</Button>
                    <Button size="sm" onClick={() => window.location.hash = "#puzzles"}>Assign Puzzle</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  )
}
