"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Plus, Pencil, DollarSign } from "lucide-react"

interface FundingProject {
  id: number
  title: string
  description: string | null
  goalAmount: string
  raisedAmount: string
  status: string
  createdAt: string
  _count?: {
    donations: number
  }
}

interface Donation {
  id: number
  amount: string
  message: string | null
  createdAt: string
  user: {
    name: string | null
    email: string
  }
  project?: {
    title: string
  }
}

export function FundingTab() {
  const [projects, setProjects] = useState<FundingProject[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<FundingProject | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    imageUrl: "",
    status: "active"
  })

  async function loadData() {
    setLoading(true)
    setError(null)
    try {
      const [projectsRes, donationsRes] = await Promise.all([
        fetch("/api/admin/funding", { cache: "no-store" }),
        fetch("/api/admin/donations", { cache: "no-store" })
      ])
      
      const projectsData = await projectsRes.json()
      const donationsData = await donationsRes.json()
      
      if (!projectsRes.ok) throw new Error(projectsData.error || "Failed to load projects")
      if (!donationsRes.ok) throw new Error(donationsData.error || "Failed to load donations")
      
      setProjects(projectsData.projects)
      setDonations(donationsData.donations)
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
      const url = editingProject ? `/api/admin/funding/${editingProject.id}` : "/api/admin/funding"
      const method = editingProject ? "PATCH" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save project")
      
      setDialogOpen(false)
      setEditingProject(null)
      setFormData({
        title: "",
        description: "",
        goalAmount: "",
        imageUrl: "",
        status: "active"
      })
      await loadData()
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    }
  }

  function openEditDialog(project: FundingProject) {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description || "",
      goalAmount: project.goalAmount,
      imageUrl: "",
      status: project.status
    })
    setDialogOpen(true)
  }

  function openCreateDialog() {
    setEditingProject(null)
    setFormData({
      title: "",
      description: "",
      goalAmount: "",
      imageUrl: "",
      status: "active"
    })
    setDialogOpen(true)
  }

  const getProgress = (raised: string, goal: string) => {
    const r = parseFloat(raised)
    const g = parseFloat(goal)
    return g > 0 ? Math.min((r / g) * 100, 100) : 0
  }

  const totalRaised = donations.reduce((sum, d) => sum + parseFloat(d.amount), 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6 glass">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-sm opacity-70">Total Raised</p>
              <p className="text-2xl font-bold">${totalRaised.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 glass">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💰</span>
            <div>
              <p className="text-sm opacity-70">Active Projects</p>
              <p className="text-2xl font-bold">{projects.filter(p => p.status === "active").length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 glass">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎁</span>
            <div>
              <p className="text-sm opacity-70">Total Donations</p>
              <p className="text-2xl font-bold">{donations.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Projects */}
      <Card className="p-6 glass">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-xl">Funding Projects</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => loadData()}>Refresh</Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog}><Plus className="w-4 h-4 mr-2" /> New Project</Button>
              </DialogTrigger>
              <DialogContent className="glass-strong max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingProject ? "Edit Project" : "Create Project"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Project Title</label>
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
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Goal Amount ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.goalAmount}
                      onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                      required
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
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">{editingProject ? "Update" : "Create"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        
        {loading ? (
          <div className="flex items-center gap-2"><Loader2 className="animate-spin h-5 w-5" /> Loading projects...</div>
        ) : projects.length === 0 ? (
          <p className="opacity-70">No funding projects yet. Create your first one!</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="p-4 rounded-lg border border-white/10 hover:bg-white/5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-sm opacity-70 mt-1">{project.description}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => openEditDialog(project)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>${project.raisedAmount} raised</span>
                    <span>Goal: ${project.goalAmount}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${getProgress(project.raisedAmount, project.goalAmount)}%` }}
                    />
                  </div>
                  <div className="flex gap-4 mt-2 text-xs opacity-70">
                    <span>💝 {project._count?.donations || 0} donations</span>
                    <span className={`px-2 py-1 rounded ${project.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Donations */}
      <Card className="p-6 glass">
        <h2 className="font-semibold text-xl mb-4">Recent Donations</h2>
        {donations.length === 0 ? (
          <p className="opacity-70">No donations yet.</p>
        ) : (
          <div className="overflow-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.slice(0, 10).map((donation) => (
                  <TableRow key={donation.id} className="hover:bg-white/5">
                    <TableCell>{donation.user.name || donation.user.email}</TableCell>
                    <TableCell className="font-mono text-green-400">${donation.amount}</TableCell>
                    <TableCell>{donation.project?.title || "General"}</TableCell>
                    <TableCell className="text-sm opacity-70">{donation.message || "—"}</TableCell>
                    <TableCell className="text-xs opacity-70">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </TableCell>
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
