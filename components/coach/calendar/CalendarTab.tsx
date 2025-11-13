"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

interface Lesson {
  id: number
  title: string
  scheduledAt: string
  duration?: number | null
  capacity?: number | null
  status: string
}

export function CalendarTab() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [datetime, setDatetime] = useState("")
  const [duration, setDuration] = useState<number | "">(60)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/coach/lessons")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to fetch lessons")
      setLessons(data.lessons)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  async function createLesson(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch("/api/coach/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, scheduledAt: datetime, duration: duration === "" ? undefined : duration }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create lesson")
      setTitle("")
      setDatetime("")
      setDuration(60)
      void load()
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      setError(msg)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="p-6 glass">
        <h2 className="font-semibold text-xl mb-4">Plan a Class</h2>
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        <form className="space-y-3" onSubmit={createLesson}>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tactics Session" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date & Time</label>
            <Input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration (mins)</label>
            <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value === "" ? "" : Number(e.target.value))} />
          </div>
          <Button type="submit">Create Lesson</Button>
        </form>
      </Card>
      <Card className="p-6 glass">
        <h2 className="font-semibold text-xl mb-4">Upcoming Classes</h2>
        {loading ? (
          <p>Loading...</p>
        ) : lessons.length === 0 ? (
          <p className="opacity-70">No upcoming classes.</p>
        ) : (
          <div className="overflow-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>When</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>{l.title}</TableCell>
                    <TableCell>{new Date(l.scheduledAt).toLocaleString()}</TableCell>
                    <TableCell>{l.duration ?? "—"}</TableCell>
                    <TableCell>{l.status}</TableCell>
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
