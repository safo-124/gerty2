import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const coaches = [
  {
    id: 1,
    name: "GM Alexandra Petrov",
    title: "Grandmaster",
    rating: 2650,
    specialty: "Opening Theory",
    bio: "Former World Championship challenger with 20+ years of coaching experience.",
    image: "👩‍🏫"
  },
  {
    id: 2,
    name: "IM David Kim",
    title: "International Master",
    rating: 2480,
    specialty: "Endgame Mastery",
    bio: "Specialized in teaching advanced endgame techniques and positional play.",
    image: "👨‍🏫"
  },
  {
    id: 3,
    name: "WGM Sofia Martinez",
    title: "Woman Grandmaster",
    rating: 2420,
    specialty: "Junior Development",
    bio: "Expert in coaching young talents and building strong chess foundations.",
    image: "👩‍🎓"
  },
  {
    id: 4,
    name: "GM Robert Chen",
    title: "Grandmaster",
    rating: 2580,
    specialty: "Tactical Training",
    bio: "Known for developing tactical vision and calculation skills in students.",
    image: "👨‍💼"
  },
]

export default function CoachesPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center">Our Expert Coaches</h1>
        <p className="text-xl text-center mb-12 opacity-80">
          Learn from world-class Grandmasters and International Masters
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {coaches.map((coach) => (
            <Card key={coach.id} className="p-8 glass hover:scale-[1.02] transition-transform">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-6xl">{coach.image}</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-1">{coach.name}</h2>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="secondary">{coach.title}</Badge>
                    <Badge variant="outline">Rating: {coach.rating}</Badge>
                  </div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {coach.specialty}
                  </p>
                </div>
              </div>
              <p className="opacity-80 mb-4">{coach.bio}</p>
              <Button variant="outline" className="glass w-full">Book a Lesson</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
