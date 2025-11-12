import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function StudentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6 glass">
          <h2 className="font-semibold mb-2">Upcoming Lessons</h2>
          <p className="text-sm opacity-80">See your schedule and join sessions.</p>
          <div className="mt-4"><Button>View Schedule</Button></div>
        </Card>
        <Card className="p-6 glass">
          <h2 className="font-semibold mb-2">Donate</h2>
          <p className="text-sm opacity-80">Support our NGO initiatives.</p>
          <div className="mt-4"><Button>Donate</Button></div>
        </Card>
      </div>
    </div>
  )
}
