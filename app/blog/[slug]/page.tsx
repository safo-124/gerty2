import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react"

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      imageUrl: true,
      published: true,
      author: { select: { name: true, email: true } },
    },
  })

  if (!post || !post.published) return notFound()

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-b from-purple-950/20 via-transparent to-blue-950/20">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Button asChild variant="ghost" className="glass mb-8 group">
          <Link href="/blog" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
        </Button>

        {/* Article header */}
        <Card className="glass border border-white/10 overflow-hidden">
          {/* Featured image */}
          {post.imageUrl && (
            <div className="relative w-full h-[400px] overflow-hidden">
              <Image 
                src={post.imageUrl} 
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm opacity-70 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author?.name || post.author?.email || "Admin"}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.createdAt).toLocaleDateString("en-US", { 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              {post.title}
            </h1>

            {/* Share button */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-white/10">
              <Button variant="outline" size="sm" className="glass">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Article content */}
            <article className="prose prose-invert prose-lg max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed text-base md:text-lg opacity-90">
                {post.content}
              </div>
            </article>
          </div>
        </Card>

        {/* Bottom navigation */}
        <div className="mt-12 flex items-center justify-between">
          <Button asChild variant="outline" className="glass group">
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              More Articles
            </Link>
          </Button>
          
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            Subscribe to Newsletter
          </Button>
        </div>
      </div>
    </div>
  )
}
