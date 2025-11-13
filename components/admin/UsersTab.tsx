"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"

interface AdminUser {
  id: number
  email: string
  name: string | null
  role: "ADMIN" | "COACH" | "STUDENT"
  createdAt: string
  approved?: boolean
}

export function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function loadUsers() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load users")
      setUsers(data.users)
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [])

  async function updateRole(id: number, role: AdminUser["role"]) {
    setSaving(id)
    setError(null)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update role")
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)))
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    } finally {
      setSaving(null)
    }
  }

  async function approveUser(id: number, approved: boolean) {
    setSaving(id)
    setError(null)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, approved }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update approval")
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, approved } : u)))
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    } finally {
      setSaving(null)
    }
  }

  async function deleteUser(id: number) {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return
    setSaving(id)
    setError(null)
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete user")
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    } finally {
      setSaving(null)
    }
  }

  return (
    <Card className="p-6 glass">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-xl">User Management</h2>
        <Button variant="outline" onClick={() => loadUsers()}>Refresh</Button>
      </div>
      
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      
      {loading ? (
        <div className="flex items-center gap-2"><Loader2 className="animate-spin h-5 w-5" /> Loading users...</div>
      ) : users.length === 0 ? (
        <p className="opacity-70">No users found.</p>
      ) : (
        <div className="overflow-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} className="hover:bg-white/5">
                  <TableCell className="font-mono text-xs">{u.id}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.name || "—"}</TableCell>
                  <TableCell>
                    <Select
                      value={u.role}
                      onValueChange={(val) => updateRole(u.id, val as AdminUser["role"])}
                      disabled={saving === u.id}
                    >
                      <SelectTrigger className="w-[130px] glass">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-strong">
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                        <SelectItem value="COACH">COACH</SelectItem>
                        <SelectItem value="STUDENT">STUDENT</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {u.role === "ADMIN" ? (
                      <span className="text-xs opacity-70">N/A</span>
                    ) : u.approved ? (
                      <span className="text-green-500 text-xs font-medium">Approved</span>
                    ) : (
                      <span className="text-yellow-500 text-xs font-medium">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {u.role !== "ADMIN" && (
                      <>
                        {u.approved ? (
                          <Button variant="outline" size="sm" disabled={saving === u.id} onClick={() => approveUser(u.id, false)}>Unapprove</Button>
                        ) : (
                          <Button size="sm" disabled={saving === u.id} onClick={() => approveUser(u.id, true)}>Approve</Button>
                        )}
                        <Button variant="destructive" size="sm" disabled={saving === u.id} onClick={() => deleteUser(u.id)}>Delete</Button>
                      </>
                    )}
                  </TableCell>
                  <TableCell className="text-xs opacity-70">
                    {new Date(u.createdAt).toLocaleDateString()}
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
