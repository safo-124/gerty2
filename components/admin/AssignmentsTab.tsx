"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"

interface Student {
  id: number
  email: string
  name: string | null
  studentProfile?: {
    coachId?: number | null
  }
}

interface Coach {
  id: number
  email: string
  name: string | null
}

export function AssignmentsTab() {
  const [students, setStudents] = useState<Student[]>([])
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function loadData() {
    setLoading(true)
    setError(null)
    try {
      const [studentsRes, coachesRes] = await Promise.all([
        fetch("/api/admin/students", { cache: "no-store" }),
        fetch("/api/admin/coaches", { cache: "no-store" })
      ])
      
      const studentsData = await studentsRes.json()
      const coachesData = await coachesRes.json()
      
      if (!studentsRes.ok) throw new Error(studentsData.error || "Failed to load students")
      if (!coachesRes.ok) throw new Error(coachesData.error || "Failed to load coaches")
      
      setStudents(studentsData.students)
      setCoaches(coachesData.coaches)
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  async function assignCoach(studentId: number, coachId: number | null) {
    setAssigning(studentId)
    setError(null)
    try {
      const res = await fetch("/api/admin/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, coachId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to assign coach")
      
      // Refresh data
      await loadData()
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    } finally {
      setAssigning(null)
    }
  }

  const getCoachName = (coachId?: number | null) => {
    if (!coachId) return "Unassigned"
    const coach = coaches.find(c => c.id === coachId)
    return coach ? (coach.name || coach.email) : "Unknown"
  }

  return (
    <Card className="p-6 glass">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-xl">Student-Coach Assignments</h2>
        <Button variant="outline" onClick={() => loadData()}>Refresh</Button>
      </div>
      
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      
      {loading ? (
        <div className="flex items-center gap-2"><Loader2 className="animate-spin h-5 w-5" /> Loading assignments...</div>
      ) : students.length === 0 ? (
        <p className="opacity-70">No students found.</p>
      ) : (
        <div className="overflow-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Assigned Coach</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id} className="hover:bg-white/5">
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.name || "—"}</TableCell>
                  <TableCell>
                    <span className={s.studentProfile?.coachId ? "text-green-400" : "opacity-50"}>
                      {getCoachName(s.studentProfile?.coachId)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={s.studentProfile?.coachId?.toString() || "none"}
                      onValueChange={(val) => assignCoach(s.id, val === "none" ? null : parseInt(val))}
                      disabled={assigning === s.id}
                    >
                      <SelectTrigger className="w-[180px] glass">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-strong">
                        <SelectItem value="none">Unassign</SelectItem>
                        {coaches.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.name || c.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {coaches.length === 0 && !loading && (
        <p className="mt-4 text-sm opacity-70">No coaches available. Please assign COACH role to users first.</p>
      )}
    </Card>
  )
}
