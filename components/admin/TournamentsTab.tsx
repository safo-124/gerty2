"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Plus, Pencil } from "lucide-react"

interface Tournament {
  id: number
  name: string
  description: string | null
  startDate: string
  endDate: string | null
  location: string | null
  maxPlayers: number | null
  status: string
  _count: {
    participants: number
  }
}

export function TournamentsTab() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    maxPlayers: "",
    registrationDeadline: "",
    imageUrl: "",
    status: "upcoming"
  })

  async function loadTournaments() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/tournaments", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load tournaments")
      setTournaments(data.tournaments)
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadTournaments()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const url = editingTournament ? `/api/admin/tournaments/${editingTournament.id}` : "/api/admin/tournaments"
      const method = editingTournament ? "PATCH" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save tournament")
      
      setDialogOpen(false)
      setEditingTournament(null)
      setFormData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        maxPlayers: "",
        registrationDeadline: "",
        imageUrl: "",
        status: "upcoming"
      })
      await loadTournaments()
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    }
  }

  function openEditDialog(tournament: Tournament) {
    setEditingTournament(tournament)
    setFormData({
      name: tournament.name,
      description: tournament.description || "",
      startDate: tournament.startDate.slice(0, 16),
      endDate: tournament.endDate ? tournament.endDate.slice(0, 16) : "",
      location: tournament.location || "",
      maxPlayers: tournament.maxPlayers?.toString() || "",
      registrationDeadline: "",
      imageUrl: "",
      status: tournament.status
    })
    setDialogOpen(true)
  }

  function openCreateDialog() {
    setEditingTournament(null)
    setFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      maxPlayers: "",
      registrationDeadline: "",
      imageUrl: "",
      status: "upcoming"
    })
    setDialogOpen(true)
  }

  return (
    <Card className="p-6 glass">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-xl">Tournament Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => loadTournaments()}>Refresh</Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}><Plus className="w-4 h-4 mr-2" /> New Tournament</Button>
            </DialogTrigger>
            <DialogContent className="glass-strong max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingTournament ? "Edit Tournament" : "Create Tournament"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Tournament Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    <label className="text-sm font-medium">Start Date</label>
                    <Input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                      className="glass"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <Input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="glass"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="glass"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Max Players</label>
                    <Input
                      type="number"
                      value={formData.maxPlayers}
                      onChange={(e) => setFormData({ ...formData, maxPlayers: e.target.value })}
                      className="glass"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Registration Deadline</label>
                  <Input
                    type="datetime-local"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    className="glass"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Image URL</label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="glass"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-md glass"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingTournament ? "Update" : "Create"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      
      {loading ? (
        <div className="flex items-center gap-2"><Loader2 className="animate-spin h-5 w-5" /> Loading tournaments...</div>
      ) : tournaments.length === 0 ? (
        <p className="opacity-70">No tournaments yet. Create your first one!</p>
      ) : (
        <div className="overflow-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tournaments.map((tournament) => (
                <TableRow key={tournament.id} className="hover:bg-white/5">
                  <TableCell className="font-medium">{tournament.name}</TableCell>
                  <TableCell>{tournament.location || "—"}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(tournament.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {tournament._count.participants}
                    {tournament.maxPlayers ? `/${tournament.maxPlayers}` : ""}
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded ${
                      tournament.status === "upcoming" ? "bg-blue-500/20 text-blue-400" :
                      tournament.status === "ongoing" ? "bg-yellow-500/20 text-yellow-400" :
                      tournament.status === "completed" ? "bg-green-500/20 text-green-400" :
                      "bg-gray-500/20 text-gray-400"
                    }`}>
                      {tournament.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => openEditDialog(tournament)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
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
