import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/prisma"
import { Star, Award, Users, CheckCircle2, Calendar, MessageSquare } from "lucide-react"

type Coach = {
  id: number
  name: string | null
  email: string
  coachProfile: { bio: string | null; rating: number | null; availability: string | null } | null
}

async function getCoaches(): Promise<Coach[]> {
  // Query directly from the database on the server to avoid relative URL issues
  const coaches = await prisma.user.findMany({
    where: { role: "COACH", approved: true },
    select: {
      id: true,
      name: true,
      email: true,
      coachProfile: { select: { bio: true, rating: true, availability: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
  return coaches as Coach[]
}

export default async function CoachesPage() {
  const coaches = await getCoaches()
  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-b from-green-950/20 via-transparent to-blue-950/20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-2 rounded-full glass mb-4">
            <span className="text-sm font-medium bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2 justify-center">
              <Award className="w-4 h-4 text-green-400" />
              Expert Instruction
            </span>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Our Expert Coaches
          </h1>
          <p className="text-xl opacity-70 max-w-2xl mx-auto">
            Learn from world-class Grandmasters and International Masters who are passionate about teaching
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="p-6 glass border border-green-500/20 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {coaches.length}
            </div>
            <div className="text-sm opacity-70">Active Coaches</div>
          </Card>
          <Card className="p-6 glass border border-blue-500/20 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              4.9
            </div>
            <div className="text-sm opacity-70">Average Rating</div>
          </Card>
          <Card className="p-6 glass border border-purple-500/20 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              2000+
            </div>
            <div className="text-sm opacity-70">Students Taught</div>
          </Card>
        </div>
        
        {/* Coach Cards */}
        {coaches.length === 0 ? (
          <Card className="p-12 glass text-center border border-white/10">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full glass-strong mx-auto flex items-center justify-center">
                <Users className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="text-xl font-semibold">No coaches available yet</h3>
              <p className="opacity-70">Check back soon for our expert coaching team!</p>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {coaches.map((coach) => (
              <Card 
                key={coach.id} 
                className="glass border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/20 group overflow-hidden"
              >
                {/* Top accent */}
                <div className="h-1 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400" />
                
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center text-4xl">
                        ♟️
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-gray-950 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all">
                        {coach.name || coach.email}
                      </h2>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30">
                          <Award className="w-3 h-3 mr-1" />
                          Verified Coach
                        </Badge>
                        {coach.coachProfile?.rating && (
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 hover:bg-amber-500/30">
                            <Star className="w-3 h-3 mr-1" />
                            {coach.coachProfile.rating}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-green-400">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        {coach.coachProfile?.availability || "Accepting students"}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="opacity-80 mb-6 leading-relaxed">
                    {coach.coachProfile?.bio || "Experienced chess coach dedicated to helping students improve their game through personalized instruction and strategic guidance."}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                    <div className="flex items-center gap-2 opacity-70">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      Flexible Schedule
                    </div>
                    <div className="flex items-center gap-2 opacity-70">
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                      1-on-1 Sessions
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all group/btn">
                      Book a Lesson
                      <Calendar className="w-4 h-4 ml-2 group-hover/btn:scale-110 transition-transform" />
                    </Button>
                    <Button variant="outline" className="glass border-green-500/30 hover:border-green-500/60 hover:bg-green-500/10">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Card className="inline-block p-8 glass border border-green-500/20">
            <Award className="w-12 h-12 mx-auto mb-4 text-green-400" />
            <h3 className="text-2xl font-bold mb-3">Want to Join Our Team?</h3>
            <p className="opacity-70 mb-6 max-w-md">
              Are you an experienced chess coach? Apply to join our academy and help students reach their potential.
            </p>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 hover:shadow-lg hover:shadow-green-500/50 transition-all">
              Apply as Coach
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
