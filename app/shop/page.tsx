import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const products = [
  {
    id: 1,
    name: "Professional Chess Set",
    price: 89.99,
    category: "Equipment",
    image: "♟️",
    description: "Tournament-grade wooden chess set with weighted pieces"
  },
  {
    id: 2,
    name: "Academy T-Shirt",
    price: 24.99,
    category: "Apparel",
    image: "👕",
    description: "Premium cotton t-shirt with academy logo"
  },
  {
    id: 3,
    name: "Chess Strategy Book Bundle",
    price: 49.99,
    category: "Books",
    image: "📚",
    description: "Collection of 5 essential chess strategy books"
  },
  {
    id: 4,
    name: "Digital Chess Clock",
    price: 39.99,
    category: "Equipment",
    image: "⏱️",
    description: "Professional digital chess clock with multiple modes"
  },
  {
    id: 5,
    name: "Academy Hoodie",
    price: 54.99,
    category: "Apparel",
    image: "🧥",
    description: "Comfortable hoodie with embroidered logo"
  },
  {
    id: 6,
    name: "Chess Training Software",
    price: 79.99,
    category: "Digital",
    image: "💻",
    description: "1-year subscription to premium training platform"
  },
]

export default function ShopPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center">Academy Shop</h1>
        <p className="text-xl text-center mb-12 opacity-80">
          All proceeds support our charity mission
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="p-6 glass hover:scale-[1.02] transition-transform">
              <div className="text-6xl text-center mb-4">{product.image}</div>
              <Badge variant="secondary" className="mb-2">{product.category}</Badge>
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-sm opacity-80 mb-4">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
