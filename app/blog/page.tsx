import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { Calendar, User, ArrowRight } from "lucide-react"

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
    <div className="min-h-screen py-20 px-4 bg-gradient-to-b from-purple-950/20 via-transparent to-blue-950/20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-2 rounded-full glass mb-4">
            <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Chess Academy Blog
            </span>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Latest News & Articles
          </h1>
          <p className="text-lg opacity-70 max-w-2xl mx-auto">
            Discover insights, strategies, and stories from the world of chess
          </p>
        </div>

        {posts.length === 0 ? (
          <Card className="p-12 glass text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full glass-strong mx-auto flex items-center justify-center">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold">No articles yet</h3>
              <p className="opacity-70">Check back soon for exciting chess content!</p>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post, idx) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`}
                className="group block h-full"
              >
                <Card className={`h-full p-6 glass hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 border border-white/10 hover:border-purple-500/50 ${
                  idx === 0 ? "md:col-span-2" : ""
                }`}>
                  <div className="flex flex-col h-full">
                    {/* Badge for first post */}
                    {idx === 0 && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 w-fit mb-4">
                        <span className="text-xs font-semibold text-blue-400">Featured</span>
                      </div>
                    )}

                    {/* Title */}
                    <h2 className={`font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all ${
                      idx === 0 ? "text-3xl" : "text-xl"
                    }`}>
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className={`opacity-80 mb-4 flex-grow ${idx === 0 ? "text-lg" : "text-base"}`}>
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta info */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4 text-sm opacity-70">
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4" />
                          <span>{post.author?.name || post.author?.email || "Admin"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-blue-400 group-hover:text-purple-400 transition-colors">
                        Read More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Call to action */}
        {posts.length > 0 && (
          <div className="mt-16 text-center">
            <Card className="inline-block p-8 glass">
              <h3 className="text-2xl font-bold mb-3">Stay Updated</h3>
              <p className="opacity-70 mb-6 max-w-md">
                Want to receive the latest chess news and articles directly to your inbox?
              </p>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                Subscribe to Newsletter
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
