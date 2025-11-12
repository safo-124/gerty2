"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Send } from "lucide-react"

export function CommunicationsTab() {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    targetRole: "all"
  })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError(null)
    setSuccess(null)
    
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send notification")
      
      setSuccess(`Notification sent successfully to ${data.recipientCount} users!`)
      setFormData({
        title: "",
        message: "",
        targetRole: "all"
      })
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 glass">
        <h2 className="font-semibold text-xl mb-4">Send Notification</h2>
        
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        {success && <p className="text-sm text-green-400 mb-4">{success}</p>}
        
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Target Audience</label>
            <Select value={formData.targetRole} onValueChange={(val) => setFormData({ ...formData, targetRole: val })}>
              <SelectTrigger className="glass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-strong">
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="ADMIN">Admins Only</SelectItem>
                <SelectItem value="COACH">Coaches Only</SelectItem>
                <SelectItem value="STUDENT">Students Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="glass"
              placeholder="Announcement title"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Message</label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              className="glass"
              rows={6}
              placeholder="Your message to users..."
            />
          </div>
          
          <Button type="submit" disabled={sending} className="w-full">
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" /> Send Notification
              </>
            )}
          </Button>
        </form>
      </Card>

      <Card className="p-6 glass">
        <h3 className="font-semibold mb-3">📧 Communication Tips</h3>
        <ul className="space-y-2 text-sm opacity-80">
          <li>• Use clear and concise titles</li>
          <li>• Target specific audiences when relevant</li>
          <li>• Include action items or deadlines if applicable</li>
          <li>• Be professional and encouraging</li>
          <li>• Notify about new lessons, tournaments, or funding projects</li>
        </ul>
      </Card>
    </div>
  )
}
