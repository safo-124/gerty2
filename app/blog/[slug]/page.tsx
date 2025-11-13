import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Card } from "@/components/ui/card"

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
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/blog" className="text-sm opacity-70 hover:underline">← Back to Blog</Link>
          <span className="text-sm opacity-60">{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>

        <h1 className="text-4xl font-bold">{post.title}</h1>
        <div className="opacity-70">By {post.author?.name || post.author?.email || "Admin"}</div>

        {post.imageUrl && (
          <Card className="p-2 glass">
            <img src={post.imageUrl} alt="" className="w-full h-auto rounded-md" />
          </Card>
        )}

        <article className="prose prose-invert max-w-none whitespace-pre-wrap">{post.content}</article>
      </div>
    </div>
  )
}
