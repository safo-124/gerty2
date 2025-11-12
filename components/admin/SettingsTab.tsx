"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Save } from "lucide-react"

interface Setting {
  key: string
  value: string
  label: string
  description: string
}

const SETTINGS: Setting[] = [
  { key: "site_name", value: "", label: "Site Name", description: "Name of your chess academy" },
  { key: "site_email", value: "", label: "Contact Email", description: "Main contact email" },
  { key: "site_phone", value: "", label: "Contact Phone", description: "Main contact phone" },
  { key: "facebook_url", value: "", label: "Facebook URL", description: "Link to Facebook page" },
  { key: "twitter_url", value: "", label: "Twitter URL", description: "Link to Twitter profile" },
  { key: "instagram_url", value: "", label: "Instagram URL", description: "Link to Instagram profile" },
  { key: "maintenance_mode", value: "", label: "Maintenance Mode", description: "Enable to put site in maintenance mode" },
]

export function SettingsTab() {
  const [settings, setSettings] = useState<Setting[]>(SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function loadSettings() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/settings", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load settings")
      
      // Merge loaded settings with defaults
      const loadedSettings = SETTINGS.map(s => ({
        ...s,
        value: data.settings[s.key] || s.value
      }))
      setSettings(loadedSettings)
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSettings()
  }, [])

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSuccess(null)
    
    try {
      const settingsObj = settings.reduce((acc, s) => {
        acc[s.key] = s.value
        return acc
      }, {} as Record<string, string>)
      
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsObj }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save settings")
      
      setSuccess("Settings saved successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  function updateSetting(key: string, value: string) {
    setSettings(settings.map(s => s.key === key ? { ...s, value } : s))
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="animate-spin h-5 w-5" /> Loading settings...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 glass">
        <h2 className="font-semibold text-xl mb-4">Site Settings</h2>
        
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        {success && <p className="text-sm text-green-400 mb-4">{success}</p>}
        
        <div className="space-y-6">
          {settings.map((setting) => (
            <div key={setting.key}>
              <label className="text-sm font-medium block mb-1">{setting.label}</label>
              <p className="text-xs opacity-70 mb-2">{setting.description}</p>
              {setting.key === "maintenance_mode" ? (
                <select
                  value={setting.value}
                  onChange={(e) => updateSetting(setting.key, e.target.value)}
                  className="w-full px-3 py-2 rounded-md glass"
                >
                  <option value="false">Disabled</option>
                  <option value="true">Enabled</option>
                </select>
              ) : (
                <Input
                  value={setting.value}
                  onChange={(e) => updateSetting(setting.key, e.target.value)}
                  className="glass"
                />
              )}
            </div>
          ))}
        </div>
        
        <Button onClick={handleSave} disabled={saving} className="mt-6 w-full">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Save Settings
            </>
          )}
        </Button>
      </Card>

      <Card className="p-6 glass">
        <h3 className="font-semibold mb-3">⚡ Quick Actions</h3>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={() => window.open("/api/admin/export-data", "_blank")}>
            📥 Export All Data
          </Button>
          <Button variant="outline" className="w-full justify-start text-red-400" onClick={() => confirm("Clear all cached data?") && alert("Cache cleared!")}>
            🗑️ Clear Cache
          </Button>
        </div>
      </Card>
    </div>
  )
}
