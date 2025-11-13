import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trophy, Users, Clock, ArrowRight, Crown, Zap } from "lucide-react"

const tournaments = [
  {
    id: 1,
    name: "Winter Championship 2025",
    date: "Dec 15-17, 2025",
    prize: "$5,000",
    status: "Open",
    level: "All Levels"
  },
  {
    id: 2,
    name: "Charity Blitz Tournament",
    date: "Nov 25, 2025",
    prize: "Donations",
    status: "Open",
    level: "All Levels"
  },
  {
    id: 3,
    name: "Junior Grand Prix",
    date: "Jan 10-12, 2026",
    prize: "$2,000",
    status: "Coming Soon",
    level: "Under 18"
  },
]

export default function TournamentsPage() {
  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-b from-blue-950/20 via-transparent to-purple-950/20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-2 rounded-full glass mb-4">
            <span className="text-sm font-medium bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent flex items-center gap-2 justify-center">
              <Trophy className="w-4 h-4 text-amber-400" />
              Competitive Chess
            </span>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            Upcoming Tournaments
          </h1>
          <p className="text-xl opacity-70 max-w-2xl mx-auto">
            Compete with players worldwide and test your skills in our exciting tournaments
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="p-6 glass border border-amber-500/20 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              {tournaments.length}
            </div>
            <div className="text-sm opacity-70">Active Tournaments</div>
          </Card>
          <Card className="p-6 glass border border-blue-500/20 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              500+
            </div>
            <div className="text-sm opacity-70">Total Players</div>
          </Card>
          <Card className="p-6 glass border border-green-500/20 text-center">
            <Crown className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              $10K+
            </div>
            <div className="text-sm opacity-70">Prize Money</div>
          </Card>
        </div>
        
        {/* Tournament Cards */}
        <div className="grid gap-6">
          {tournaments.map((tournament, idx) => (
            <Card 
              key={tournament.id} 
              className={`glass border transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl group ${
                tournament.status === "Open" 
                  ? "border-green-500/30 hover:border-green-500/60 hover:shadow-green-500/20" 
                  : "border-white/10 hover:border-purple-500/50 hover:shadow-purple-500/20"
              }`}
            >
              <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left side - Tournament icon */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${
                    idx === 0 
                      ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30" 
                      : idx === 1 
                      ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30"
                      : "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30"
                  }`}>
                    {idx === 0 ? (
                      <Crown className="w-8 h-8 text-amber-400" />
                    ) : idx === 1 ? (
                      <Zap className="w-8 h-8 text-blue-400" />
                    ) : (
                      <Trophy className="w-8 h-8 text-green-400" />
                    )}
                  </div>

                  {/* Middle - Tournament details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl md:text-3xl font-bold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-orange-400 group-hover:bg-clip-text transition-all">
                        {tournament.name}
                      </h2>
                      <Badge 
                        variant={tournament.status === "Open" ? "default" : "secondary"}
                        className={tournament.status === "Open" 
                          ? "bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30" 
                          : "bg-gray-500/20 text-gray-400 border-gray-500/50"
                        }
                      >
                        <div className="flex items-center gap-1">
                          {tournament.status === "Open" && (
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          )}
                          {tournament.status}
                        </div>
                      </Badge>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="opacity-80">{tournament.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span className="opacity-80">Prize: {tournament.prize}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-purple-400" />
                        <span className="opacity-80">{tournament.level}</span>
                      </div>
                    </div>

                    {/* Tournament Features */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="text-xs px-3 py-1 rounded-full glass-strong border border-white/10">
                        Online
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full glass-strong border border-white/10">
                        Rated
                      </span>
                      {idx === 1 && (
                        <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Blitz
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right side - CTA */}
                  <div className="flex items-center lg:items-start">
                    <Button 
                      size="lg" 
                      className={`group/btn ${
                        tournament.status === "Open"
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                          : "bg-gradient-to-r from-blue-500 to-purple-600"
                      } text-white border-0 shadow-lg hover:shadow-xl transition-all`}
                    >
                      {tournament.status === "Open" ? "Register Now" : "Notify Me"}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Card className="inline-block p-8 glass border border-amber-500/20">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-amber-400" />
            <h3 className="text-2xl font-bold mb-3">Want to Host a Tournament?</h3>
            <p className="opacity-70 mb-6 max-w-md">
              Contact us to organize your own tournament for your community or organization.
            </p>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 hover:shadow-lg hover:shadow-amber-500/50 transition-all">
              Contact Us
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
