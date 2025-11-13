"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Payout { id: number; amount: string; status: string; createdAt: string; periodStart?: string | null; periodEnd?: string | null; note?: string | null }

export function PaymentsTab() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/coach/payouts")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to fetch payouts")
      setPayouts(data.payouts)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      setError(msg)
    } finally { setLoading(false) }
  }

  useEffect(() => { void load() }, [])

  return (
    <Card className="p-6 glass">
      <h2 className="font-semibold text-xl mb-4">Payments</h2>
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : payouts.length === 0 ? (
        <p className="opacity-70">No payouts yet.</p>
      ) : (
        <div className="overflow-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>${'{'}p.amount{'}'}</TableCell>
                  <TableCell>{p.status}</TableCell>
                  <TableCell>
                    {p.periodStart ? new Date(p.periodStart).toLocaleDateString() : "—"} - {p.periodEnd ? new Date(p.periodEnd).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="text-xs opacity-70">{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="max-w-[240px] truncate" title={p.note || undefined}>{p.note || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  )
}
