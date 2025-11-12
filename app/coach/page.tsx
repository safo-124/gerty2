import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CoachPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Coach Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6 glass">
          <h2 className="font-semibold mb-2">My Lessons</h2>
          <p className="text-sm opacity-80">Create and manage upcoming lessons.</p>
          <div className="mt-4"><Button>Create Lesson</Button></div>
        </Card>
        <Card className="p-6 glass">
          <h2 className="font-semibold mb-2">Students</h2>
          <p className="text-sm opacity-80">View enrolled students and progress.</p>
          <div className="mt-4"><Button>View Students</Button></div>
        </Card>
      </div>
    </div>
  )
}
