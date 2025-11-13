"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Student { id: number; name: string | null; email: string }
interface Msg { id: number; senderId: number; recipientId: number; content: string; createdAt: string }

export function MessagesTab() {
  const [students, setStudents] = useState<Student[]>([])
  const [messages, setMessages] = useState<Msg[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadStudents() {
    const res = await fetch("/api/coach/students")
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Failed to load students")
    setStudents(data.students)
    if (data.students.length && selectedStudentId == null) setSelectedStudentId(data.students[0].id)
  }

  async function loadMessages(studentId: number) {
    const res = await fetch(`/api/coach/messages?studentId=${studentId}`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Failed to load messages")
    setMessages(data.messages)
  }

  useEffect(() => { void loadStudents() }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (selectedStudentId) void loadMessages(selectedStudentId) }, [selectedStudentId])

  async function sendMessage() {
    if (!selectedStudentId || !body.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/coach/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudentId, content: body.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send message")
      setBody("")
      void loadMessages(selectedStudentId)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="p-6 glass">
        <h2 className="font-semibold text-xl mb-4">New Message</h2>
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">To</label>
            <Select value={selectedStudentId?.toString()}
                    onValueChange={(v) => setSelectedStudentId(Number(v))}>
              <SelectTrigger className="w-full glass">
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent className="glass-strong max-h-64 overflow-auto">
                {students.map(s => (
                  <SelectItem key={s.id} value={String(s.id)}>{s.name || s.email}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} placeholder="Type your message..." />
          </div>
          <Button onClick={sendMessage} disabled={loading || !selectedStudentId || !body.trim()}>Send</Button>
        </div>
      </Card>
      <Card className="p-6 glass">
        <h2 className="font-semibold text-xl mb-4">Conversation</h2>
        <div className="space-y-2 max-h-[420px] overflow-auto">
          {messages.length === 0 ? (
            <p className="opacity-70">No messages yet.</p>
          ) : messages.map((m) => (
            <div key={m.id} className="p-2 rounded-md border glass">
              <div className="text-xs opacity-70">{new Date(m.createdAt).toLocaleString()}</div>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
