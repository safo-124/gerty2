import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const blogPosts = [
  {
    id: 1,
    title: "10 Opening Strategies Every Beginner Should Know",
    excerpt: "Master these fundamental chess openings to gain an early advantage in your games.",
    date: "Nov 10, 2025",
    author: "GM Sarah Chen"
  },
  {
    id: 2,
    title: "How Chess Improves Academic Performance",
    excerpt: "Research shows that chess training enhances problem-solving and concentration skills.",
    date: "Nov 8, 2025",
    author: "Dr. Michael Torres"
  },
  {
    id: 3,
    title: "Our Latest Charity Tournament Results",
    excerpt: "Over $10,000 raised for chess education in rural communities.",
    date: "Nov 5, 2025",
    author: "Foundation Team"
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center">Latest News & Articles</h1>
        
        <div className="grid gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="p-8 glass hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold">{post.title}</h2>
                <span className="text-sm opacity-60">{post.date}</span>
              </div>
              <p className="text-lg opacity-80 mb-4">{post.excerpt}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-70">By {post.author}</span>
                <Button variant="outline" className="glass">Read More</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
