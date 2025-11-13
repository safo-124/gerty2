import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Brain, TrendingUp, MessageSquare, UserCircle, Award, Target } from "lucide-react";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import MyCoachTab from "@/components/student/MyCoachTab";
import LessonsTab from "@/components/student/LessonsTab";
import PuzzlesTab from "@/components/student/PuzzlesTab";
import ProgressTab from "@/components/student/ProgressTab";
import MessagesTab from "@/components/student/MessagesTab";

interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await verifySession(token);
  if (!session) return null;
  return { id: Number(session.sub), email: session.email, name: null, role: session.role };
}

export default async function StudentDashboard() {
  const user = await getUser();

  if (!user || user.role !== "STUDENT") {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Award className="h-10 w-10" />
                Welcome, {user.name || "Student"}!
              </h1>
              <p className="text-blue-100 text-lg">
                Continue your chess journey and master the game
              </p>
            </div>
            <div className="hidden lg:flex gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Target className="h-8 w-8 text-white mb-2" />
                <p className="text-white/80 text-sm">Your Level</p>
                <p className="text-white text-2xl font-bold">Intermediate</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <TrendingUp className="h-8 w-8 text-white mb-2" />
                <p className="text-white/80 text-sm">This Week</p>
                <p className="text-white text-2xl font-bold">5 Lessons</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="container mx-auto px-6 py-12">
        <Tabs defaultValue="lessons" className="space-y-8">
          {/* Tabs Navigation */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-2 border border-gray-200 dark:border-white/10 shadow-lg">
            <TabsList className="w-full grid grid-cols-2 lg:grid-cols-5 gap-2 bg-transparent">
              <TabsTrigger
                value="lessons"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">My Lessons</span>
                <span className="sm:hidden">Lessons</span>
              </TabsTrigger>
              <TabsTrigger
                value="puzzles"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Puzzles</span>
                <span className="sm:hidden">Puzzles</span>
              </TabsTrigger>
              <TabsTrigger
                value="progress"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Progress</span>
                <span className="sm:hidden">Progress</span>
              </TabsTrigger>
              <TabsTrigger
                value="coach"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <UserCircle className="h-4 w-4" />
                <span className="hidden sm:inline">My Coach</span>
                <span className="sm:hidden">Coach</span>
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Messages</span>
                <span className="sm:hidden">Messages</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <TabsContent value="lessons" className="space-y-6">
            <LessonsTab />
          </TabsContent>

          <TabsContent value="puzzles" className="space-y-6">
            <PuzzlesTab />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <ProgressTab />
          </TabsContent>

          <TabsContent value="coach" className="space-y-6">
            <MyCoachTab />
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <MessagesTab userId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
