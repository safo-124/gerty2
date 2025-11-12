"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface AnalyticsData {
  users: {
    total: number
    admins: number
    coaches: number
    students: number
    newThisMonth: number
  }
  lessons: {
    total: number
    scheduled: number
    completed: number
    enrollments: number
  }
  store: {
    totalRevenue: number
    ordersCount: number
    topProducts: Array<{ name: string; sales: number }>
  }
  funding: {
    totalDonations: number
    activeProjects: number
    totalRaised: number
  }
  activity: {
    date: string
    newUsers: number
    donations: number
  }[]
}

export function AnalyticsTab() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadAnalytics() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/analytics", { cache: "no-store" })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Failed to load analytics")
      setData(result)
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="animate-spin h-5 w-5" /> Loading analytics...
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* User Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">👥 User Statistics</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-6 glass">
            <p className="text-sm opacity-70">Total Users</p>
            <p className="text-3xl font-bold">{data.users.total}</p>
          </Card>
          <Card className="p-6 glass">
            <p className="text-sm opacity-70">Students</p>
            <p className="text-3xl font-bold text-blue-400">{data.users.students}</p>
          </Card>
          <Card className="p-6 glass">
            <p className="text-sm opacity-70">Coaches</p>
            <p className="text-3xl font-bold text-green-400">{data.users.coaches}</p>
          </Card>
          <Card className="p-6 glass">
            <p className="text-sm opacity-70">New This Month</p>
            <p className="text-3xl font-bold text-purple-400">{data.users.newThisMonth}</p>
          </Card>
        </div>
      </div>

      {/* Lessons Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">📅 Lessons Overview</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-6 glass">
            <p className="text-sm opacity-70">Total Lessons</p>
            <p className="text-3xl font-bold">{data.lessons.total}</p>
          </Card>
          <Card className="p-6 glass">
            <p className="text-sm opacity-70">Scheduled</p>
            <p className="text-3xl font-bold text-yellow-400">{data.lessons.scheduled}</p>
          </Card>
          <Card className="p-6 glass">
            <p className="text-sm opacity-70">Completed</p>
            <p className="text-3xl font-bold text-green-400">{data.lessons.completed}</p>
          </Card>
          <Card className="p-6 glass">
            <p className="text-sm opacity-70">Total Enrollments</p>
            <p className="text-3xl font-bold text-blue-400">{data.lessons.enrollments}</p>
          </Card>
        </div>
      </div>

      {/* Financial Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">💰 Financial Overview</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6 glass">
            <h3 className="text-sm opacity-70 mb-2">Store Revenue</h3>
            <p className="text-3xl font-bold text-green-400">${data.store.totalRevenue.toFixed(2)}</p>
            <p className="text-sm opacity-50 mt-1">{data.store.ordersCount} orders</p>
          </Card>
          <Card className="p-6 glass">
            <h3 className="text-sm opacity-70 mb-2">Total Donations</h3>
            <p className="text-3xl font-bold text-green-400">${data.funding.totalRaised.toFixed(2)}</p>
            <p className="text-sm opacity-50 mt-1">{data.funding.totalDonations} donations</p>
          </Card>
        </div>
      </div>

      {/* Top Products */}
      {data.store.topProducts.length > 0 && (
        <Card className="p-6 glass">
          <h3 className="font-semibold mb-4">🏆 Top Selling Products</h3>
          <div className="space-y-3">
            {data.store.topProducts.map((product, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span>{product.name}</span>
                <span className="font-mono text-green-400">{product.sales} sales</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Activity Chart */}
      {data.activity.length > 0 && (
        <Card className="p-6 glass">
          <h3 className="font-semibold mb-4">📈 Recent Activity (Last 7 Days)</h3>
          <div className="space-y-2">
            {data.activity.map((day, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="opacity-70">{new Date(day.date).toLocaleDateString()}</span>
                <div className="flex gap-4">
                  <span>👥 {day.newUsers} new users</span>
                  <span>💰 ${day.donations} donated</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
