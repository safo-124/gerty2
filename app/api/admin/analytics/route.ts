import { NextResponse } from "next/server"
import { verifySession, SESSION_COOKIE } from "@/lib/auth"
import prisma from "@/lib/prisma"

async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || ""
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`))
  const token = match?.[1]
  if (!token) return null
  return await verifySession(token)
}

export async function GET(request: Request) {
  try {
    const session = await getSession(request)
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const now = new Date()
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // User stats
    const [totalUsers, admins, coaches, students, newThisMonth] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { role: "COACH" } }),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
    ])

    // Lesson stats
    const [totalLessons, scheduled, completed, enrollments] = await Promise.all([
      prisma.lesson.count(),
      prisma.lesson.count({ where: { status: "scheduled" } }),
      prisma.lesson.count({ where: { status: "completed" } }),
      prisma.enrollment.count(),
    ])

    // Store stats
    const orders = await prisma.order.findMany({
      include: { items: true }
    })
    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total.toString()), 0)

    // Funding stats
    const donations = await prisma.donation.findMany()
    const totalRaised = donations.reduce((sum, d) => sum + parseFloat(d.amount.toString()), 0)
    const activeProjects = await prisma.fundingProject.count({ where: { status: "active" } })

    // Activity last 7 days
    const activity = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))
      
      const [newUsers, dayDonations] = await Promise.all([
        prisma.user.count({ where: { createdAt: { gte: dayStart, lte: dayEnd } } }),
        prisma.donation.findMany({ where: { createdAt: { gte: dayStart, lte: dayEnd } } })
      ])
      
      const donationsSum = dayDonations.reduce((sum, d) => sum + parseFloat(d.amount.toString()), 0)
      
      activity.push({
        date: dayStart.toISOString(),
        newUsers,
        donations: donationsSum
      })
    }

    // Top products
    const orderItems = await prisma.orderItem.groupBy({
      by: ['productId'],
      _count: { productId: true },
      orderBy: { _count: { productId: 'desc' } },
      take: 5
    })
    
    const topProductIds = orderItems.map(item => item.productId)
    const products = await prisma.storeProduct.findMany({
      where: { id: { in: topProductIds } }
    })
    
    const topProducts = orderItems.map(item => {
      const product = products.find(p => p.id === item.productId)
      return {
        name: product?.name || "Unknown",
        sales: item._count.productId
      }
    })

    return NextResponse.json({
      users: {
        total: totalUsers,
        admins,
        coaches,
        students,
        newThisMonth,
      },
      lessons: {
        total: totalLessons,
        scheduled,
        completed,
        enrollments,
      },
      store: {
        totalRevenue,
        ordersCount: orders.length,
        topProducts,
      },
      funding: {
        totalDonations: donations.length,
        activeProjects,
        totalRaised,
      },
      activity,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
