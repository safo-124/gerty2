import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center">Upcoming Tournaments</h1>
        <p className="text-xl text-center mb-12 opacity-80">
          Compete with players worldwide and test your skills in our exciting tournaments.
        </p>
        
        <div className="grid gap-6">
          {tournaments.map((tournament) => (
            <Card key={tournament.id} className="p-8 glass">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-semibold">{tournament.name}</h2>
                    <Badge variant={tournament.status === "Open" ? "default" : "secondary"}>
                      {tournament.status}
                    </Badge>
                  </div>
                  <p className="opacity-70 mb-1">📅 {tournament.date}</p>
                  <p className="opacity-70 mb-1">🏆 Prize Pool: {tournament.prize}</p>
                  <p className="opacity-70">👥 {tournament.level}</p>
                </div>
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                  Register Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
