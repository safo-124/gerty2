import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import prisma from "@/lib/prisma"

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      createdAt: true,
      author: { select: { name: true, email: true } },
    },
  })

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center">Latest News & Articles</h1>
        {posts.length === 0 ? (
          <Card className="p-8 glass">
            <p className="opacity-80 text-center">No articles yet. Please check back soon.</p>
          </Card>
        ) : (
          <div className="grid gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="p-8 glass hover:scale-[1.02] transition-transform">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-semibold">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h2>
                  <span className="text-sm opacity-60">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                {post.excerpt && <p className="text-lg opacity-80 mb-4">{post.excerpt}</p>}
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-70">By {post.author?.name || post.author?.email || "Admin"}</span>
                  <Button asChild variant="outline" className="glass">
                    <Link href={`/blog/${post.slug}`}>Read More</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
