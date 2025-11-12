"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, CheckCircle, XCircle, Eye } from "lucide-react"

interface CoachApplication {
  id: number
  name: string
  email: string
  bio: string
  experience: string | null
  rating: number | null
  status: string
  notes: string | null
  createdAt: string
}

export function CoachApplicationsTab() {
  const [applications, setApplications] = useState<CoachApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedApp, setSelectedApp] = useState<CoachApplication | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const [processing, setProcessing] = useState<number | null>(null)

  async function loadApplications() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/coach-applications", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load applications")
      setApplications(data.applications)
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadApplications()
  }, [])

  async function reviewApplication(id: number, status: "approved" | "rejected") {
    setProcessing(id)
    setError(null)
    try {
      const res = await fetch(`/api/admin/coach-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to review application")
      
      setDialogOpen(false)
      setSelectedApp(null)
      setNotes("")
      await loadApplications()
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    } finally {
      setProcessing(null)
    }
  }

  function openReviewDialog(app: CoachApplication) {
    setSelectedApp(app)
    setNotes(app.notes || "")
    setDialogOpen(true)
  }

  return (
    <Card className="p-6 glass">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-xl">Coach Applications</h2>
        <Button variant="outline" onClick={() => loadApplications()}>Refresh</Button>
      </div>
      
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      
      {loading ? (
        <div className="flex items-center gap-2"><Loader2 className="animate-spin h-5 w-5" /> Loading applications...</div>
      ) : applications.length === 0 ? (
        <p className="opacity-70">No coach applications yet.</p>
      ) : (
        <div className="overflow-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id} className="hover:bg-white/5">
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{app.rating || "—"}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded ${
                      app.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                      app.status === "approved" ? "bg-green-500/20 text-green-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {app.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs opacity-70">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => openReviewDialog(app)}>
                      <Eye className="w-4 h-4 mr-1" /> Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-strong max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Coach Application</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium opacity-70">Applicant Name</label>
                <p className="text-lg font-semibold">{selectedApp.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium opacity-70">Email</label>
                <p>{selectedApp.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium opacity-70">Bio</label>
                <p className="text-sm">{selectedApp.bio}</p>
              </div>
              {selectedApp.experience && (
                <div>
                  <label className="text-sm font-medium opacity-70">Experience</label>
                  <p className="text-sm">{selectedApp.experience}</p>
                </div>
              )}
              {selectedApp.rating && (
                <div>
                  <label className="text-sm font-medium opacity-70">Chess Rating</label>
                  <p className="text-sm font-mono">{selectedApp.rating}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium">Admin Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="glass"
                  rows={3}
                  placeholder="Add notes about this application..."
                />
              </div>
              {selectedApp.status === "pending" && (
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => reviewApplication(selectedApp.id, "rejected")}
                    disabled={processing === selectedApp.id}
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Reject
                  </Button>
                  <Button
                    onClick={() => reviewApplication(selectedApp.id, "approved")}
                    disabled={processing === selectedApp.id}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
