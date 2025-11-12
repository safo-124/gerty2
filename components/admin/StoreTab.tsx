"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"

interface StoreProduct {
  id: number
  name: string
  description: string | null
  price: string
  stock: number
  category: string | null
  published: boolean
  createdAt: string
}

export function StoreTab() {
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: 0,
    category: "",
    imageUrl: "",
    published: false
  })

  async function loadProducts() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/store", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load products")
      setProducts(data.products)
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const url = editingProduct ? `/api/admin/store/${editingProduct.id}` : "/api/admin/store"
      const method = editingProduct ? "PATCH" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save product")
      
      setDialogOpen(false)
      setEditingProduct(null)
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: 0,
        category: "",
        imageUrl: "",
        published: false
      })
      await loadProducts()
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    }
  }

  async function deleteProduct(id: number) {
    if (!confirm("Are you sure you want to delete this product?")) return
    
    setError(null)
    try {
      const res = await fetch(`/api/admin/store/${id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete product")
      await loadProducts()
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error"
      setError(message)
    }
  }

  function openEditDialog(product: StoreProduct) {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      category: product.category || "",
      imageUrl: "",
      published: product.published
    })
    setDialogOpen(true)
  }

  function openCreateDialog() {
    setEditingProduct(null)
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: 0,
      category: "",
      imageUrl: "",
      published: false
    })
    setDialogOpen(true)
  }

  return (
    <Card className="p-6 glass">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-xl">Store Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => loadProducts()}>Refresh</Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}><Plus className="w-4 h-4 mr-2" /> New Product</Button>
            </DialogTrigger>
            <DialogContent className="glass-strong max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Create Product"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Product Name</label>
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
                    <label className="text-sm font-medium">Price ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="glass"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Stock</label>
                    <Input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      required
                      className="glass"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="glass"
                    placeholder="e.g., Books, Equipment, Apparel"
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
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    id="published-store"
                  />
                  <label htmlFor="published-store" className="text-sm font-medium">Publish to store</label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingProduct ? "Update" : "Create"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      
      {loading ? (
        <div className="flex items-center gap-2"><Loader2 className="animate-spin h-5 w-5" /> Loading products...</div>
      ) : products.length === 0 ? (
        <p className="opacity-70">No products yet. Create your first one!</p>
      ) : (
        <div className="overflow-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="hover:bg-white/5">
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category || "—"}</TableCell>
                  <TableCell className="font-mono">${product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded ${product.published ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                      {product.published ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => openEditDialog(product)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteProduct(product.id)}>
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
