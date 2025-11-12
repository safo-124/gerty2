"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Plus, Pencil, Trash2, Users } from "lucide-react"

interface Lesson {
  id: number
  title: string
  description: string | null
  scheduledAt: string
  duration: number | null
  capacity: number | null
  location: string | null
  status: string
  coach: {
    id: number
    name: string | null
    email: string
  }
  _count: {
    enrollments: number
  }
}

interface Coach {
  id: number
  name: string | null
  email: string
}

export function LessonsTab() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    duration: 60,
    capacity: 10,
    location: "",
    coachId: "",
    status: "scheduled"
  })

  async function loadData() {
    setLoading(true)
    setError(null)
    try {
      const [lessonsRes, coachesRes] = await Promise.all([
        fetch("/api/admin/lessons", { cache: "no-store" }),
        fetch("/api/admin/coaches", { cache: "no-store" })
      ])
      
      const lessonsData = await lessonsRes.json()
      const coachesData = await coachesRes.json()
      
      if (!lessonsRes.ok) throw new Error(lessonsData.error || "Failed to load lessons")
      if (!coachesRes.ok) throw new Error(coachesData.error || "Failed to load coaches")
      
      setLessons(lessonsData.lessons)
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const url = editingLesson ? `/api/admin/lessons/${editingLesson.id}` : "/api/admin/lessons"
      const method = editingLesson ? "PATCH" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save lesson")
      
      setDialogOpen(false)
      setEditingLesson(null)
      resetForm()
      await loadData()
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    }
  }

  async function deleteLesson(id: number) {
    if (!confirm("Are you sure you want to delete this lesson?")) return
    
    setError(null)
    try {
      const res = await fetch(`/api/admin/lessons/${id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete lesson")
      await loadData()
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    }
  }

  function openEditDialog(lesson: Lesson) {
    setEditingLesson(lesson)
    setFormData({
      title: lesson.title,
      description: lesson.description || "",
      scheduledAt: lesson.scheduledAt.slice(0, 16),
      duration: lesson.duration || 60,
      capacity: lesson.capacity || 10,
      location: lesson.location || "",
      coachId: lesson.coach.id.toString(),
      status: lesson.status
    })
    setDialogOpen(true)
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      scheduledAt: "",
      duration: 60,
      capacity: 10,
      location: "",
      coachId: "",
      status: "scheduled"
    })
  }

  function openCreateDialog() {
    setEditingLesson(null)
    resetForm()
    setDialogOpen(true)
  }

  return (
    <Card className="p-6 glass">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-xl">Lessons Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => loadData()}>Refresh</Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}><Plus className="w-4 h-4 mr-2" /> New Lesson</Button>
            </DialogTrigger>
            <DialogContent className="glass-strong max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingLesson ? "Edit Lesson" : "Create Lesson"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="glass"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="glass"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Scheduled Date & Time</label>
                    <Input
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                      required
                      className="glass"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duration (minutes)</label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="glass"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Capacity</label>
                    <Input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      className="glass"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="glass"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Assign Coach</label>
                  <Select value={formData.coachId} onValueChange={(val) => setFormData({ ...formData, coachId: val })}>
                    <SelectTrigger className="glass">
                      <SelectValue placeholder="Select a coach" />
                    </SelectTrigger>
                    <SelectContent className="glass-strong">
                      {coaches.map((coach) => (
                        <SelectItem key={coach.id} value={coach.id.toString()}>
                          {coach.name || coach.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                    <SelectTrigger className="glass">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-strong">
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingLesson ? "Update" : "Create"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      
      {loading ? (
        <div className="flex items-center gap-2"><Loader2 className="animate-spin h-5 w-5" /> Loading lessons...</div>
      ) : lessons.length === 0 ? (
        <p className="opacity-70">No lessons yet. Create your first one!</p>
      ) : (
        <div className="overflow-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Coach</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.map((lesson) => (
                <TableRow key={lesson.id} className="hover:bg-white/5">
                  <TableCell className="font-medium">{lesson.title}</TableCell>
                  <TableCell>{lesson.coach.name || lesson.coach.email}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(lesson.scheduledAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {lesson._count.enrollments}/{lesson.capacity || "∞"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded ${
                      lesson.status === "scheduled" ? "bg-blue-500/20 text-blue-400" :
                      lesson.status === "completed" ? "bg-green-500/20 text-green-400" :
                      "bg-gray-500/20 text-gray-400"
                    }`}>
                      {lesson.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => openEditDialog(lesson)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteLesson(lesson.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
