"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentsTab, CalendarTab, PuzzlesTab, MessagesTab, PaymentsTab } from "@/components/coach"

export default function CoachDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Coach Dashboard</h1>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="glass w-full justify-start overflow-x-auto flex-wrap h-auto gap-1 p-2">
          <TabsTrigger value="students">👥 Students</TabsTrigger>
          <TabsTrigger value="calendar">📅 Calendar</TabsTrigger>
          <TabsTrigger value="puzzles">♟️ Puzzles</TabsTrigger>
          <TabsTrigger value="messages">💬 Messages</TabsTrigger>
          <TabsTrigger value="payments">💰 Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-6">
          <StudentsTab />
        </TabsContent>
        <TabsContent value="calendar" className="mt-6">
          <CalendarTab />
        </TabsContent>
        <TabsContent value="puzzles" className="mt-6">
          <PuzzlesTab />
        </TabsContent>
        <TabsContent value="messages" className="mt-6">
          <MessagesTab />
        </TabsContent>
        <TabsContent value="payments" className="mt-6">
          <PaymentsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
