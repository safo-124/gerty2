import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/prisma"

type Coach = {
  id: number
  name: string | null
  email: string
  coachProfile: { bio: string | null; rating: number | null; availability: string | null } | null
}

async function getCoaches(): Promise<Coach[]> {
  // Query directly from the database on the server to avoid relative URL issues
  const coaches = await prisma.user.findMany({
    where: { role: "COACH" },
    select: {
      id: true,
      name: true,
      email: true,
      coachProfile: { select: { bio: true, rating: true, availability: true } },
    },
  })
  // Only include approved coaches
  const filtered = (coaches as unknown as (Coach & { approved?: boolean })[]).filter(
    (c) => (c as unknown as { approved?: boolean }).approved !== false
  )
  return filtered as Coach[]
}

export default async function CoachesPage() {
  const coaches = await getCoaches()
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center">Our Expert Coaches</h1>
        <p className="text-xl text-center mb-12 opacity-80">
          Learn from world-class Grandmasters and International Masters
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {coaches.length === 0 ? (
            <Card className="p-8 glass text-center">
              <p className="opacity-80">No coaches published yet. Please check back later.</p>
            </Card>
          ) : coaches.map((coach) => (
            <Card key={coach.id} className="p-8 glass hover:scale-[1.02] transition-transform">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-6xl">♟️</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-1">{coach.name || coach.email}</h2>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="secondary">Coach</Badge>
                    {coach.coachProfile?.rating && (
                      <Badge variant="outline">Rating: {coach.coachProfile.rating}</Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {coach.coachProfile?.availability || "Accepting students"}
                  </p>
                </div>
              </div>
              <p className="opacity-80 mb-4">{coach.coachProfile?.bio || "Experienced coach ready to help you improve your chess."}</p>
              <Button variant="outline" className="glass w-full">Book a Lesson</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
