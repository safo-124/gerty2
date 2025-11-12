"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"

interface Order {
  id: number
  total: string
  status: string
  createdAt: string
  items: Array<{
    quantity: number
    price: string
    product: {
      name: string
    }
  }>
}

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<number | null>(null)

  async function loadOrders() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load orders")
      setOrders(data.orders)
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadOrders()
  }, [])

  async function updateOrderStatus(orderId: number, status: string) {
    setUpdating(orderId)
    setError(null)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update order")
      await loadOrders()
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    } finally {
      setUpdating(null)
    }
  }

  return (
    <Card className="p-6 glass">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-xl">Order Management</h2>
        <Button variant="outline" onClick={() => loadOrders()}>Refresh</Button>
      </div>
      
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      
      {loading ? (
        <div className="flex items-center gap-2"><Loader2 className="animate-spin h-5 w-5" /> Loading orders...</div>
      ) : orders.length === 0 ? (
        <p className="opacity-70">No orders yet.</p>
      ) : (
        <div className="overflow-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-white/5">
                  <TableCell className="font-mono text-xs">#{order.id}</TableCell>
                  <TableCell>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm">
                        {item.quantity}x {item.product.name}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="font-mono text-green-400">${order.total}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                      order.status === "shipped" ? "bg-blue-500/20 text-blue-400" :
                      order.status === "delivered" ? "bg-green-500/20 text-green-400" :
                      "bg-gray-500/20 text-gray-400"
                    }`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs opacity-70">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "shipped")}
                          disabled={updating === order.id}
                        >
                          Mark Shipped
                        </Button>
                      )}
                      {order.status === "shipped" && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "delivered")}
                          disabled={updating === order.id}
                        >
                          Mark Delivered
                        </Button>
                      )}
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
