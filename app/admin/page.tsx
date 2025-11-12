"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AnalyticsTab,
  UsersTab,
  AssignmentsTab,
  LessonsTab,
  TournamentsTab,
  BlogTab,
  StoreTab,
  OrdersTab,
  FundingTab,
  CommunicationsTab,
  CoachApplicationsTab,
  SettingsTab
} from "@/components/admin"

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="glass w-full justify-start overflow-x-auto flex-wrap h-auto gap-1 p-2">
          <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
          <TabsTrigger value="users">👥 Users</TabsTrigger>
          <TabsTrigger value="assignments">🎓 Assignments</TabsTrigger>
          <TabsTrigger value="lessons">📅 Lessons</TabsTrigger>
          <TabsTrigger value="tournaments">🏆 Tournaments</TabsTrigger>
          <TabsTrigger value="blog">📝 Blog</TabsTrigger>
          <TabsTrigger value="store">🛍️ Store</TabsTrigger>
          <TabsTrigger value="orders">📦 Orders</TabsTrigger>
          <TabsTrigger value="funding">💰 Funding</TabsTrigger>
          <TabsTrigger value="communications">📧 Communications</TabsTrigger>
          <TabsTrigger value="applications">📋 Applications</TabsTrigger>
          <TabsTrigger value="settings">⚙️ Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="mt-6">
          <AnalyticsTab />
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <UsersTab />
        </TabsContent>
        
        <TabsContent value="assignments" className="mt-6">
          <AssignmentsTab />
        </TabsContent>
        
        <TabsContent value="lessons" className="mt-6">
          <LessonsTab />
        </TabsContent>
        
        <TabsContent value="tournaments" className="mt-6">
          <TournamentsTab />
        </TabsContent>
        
        <TabsContent value="blog" className="mt-6">
          <BlogTab />
        </TabsContent>
        
        <TabsContent value="store" className="mt-6">
          <StoreTab />
        </TabsContent>
        
        <TabsContent value="orders" className="mt-6">
          <OrdersTab />
        </TabsContent>
        
        <TabsContent value="funding" className="mt-6">
          <FundingTab />
        </TabsContent>
        
        <TabsContent value="communications" className="mt-6">
          <CommunicationsTab />
        </TabsContent>
        
        <TabsContent value="applications" className="mt-6">
          <CoachApplicationsTab />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
