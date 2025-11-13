"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  description: string | null;
  scheduledAt: string;
  duration: number | null;
  capacity: number | null;
  location: string | null;
  status: string;
  coach: {
    name: string | null;
    email: string;
  };
  enrollment: {
    status: string;
  } | null;
  _count: {
    enrollments: number;
  };
}

export default function LessonsTab() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessons();
  }, []);

  async function fetchLessons() {
    try {
      const response = await fetch("/api/student/lessons");
      if (response.ok) {
        const data = await response.json();
        setLessons(data);
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setLoading(false);
    }
  }

  async function enrollInLesson(lessonId: number) {
    try {
      const response = await fetch("/api/student/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });
      if (response.ok) {
        fetchLessons(); // Refresh
      }
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  }

  async function cancelEnrollment(lessonId: number) {
    try {
      const response = await fetch("/api/student/lessons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });
      if (response.ok) {
        fetchLessons(); // Refresh
      }
    } catch (error) {
      console.error("Error canceling:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const upcomingLessons = lessons.filter(
    (l) => l.enrollment && l.enrollment.status === "enrolled"
  );
  const availableLessons = lessons.filter((l) => !l.enrollment);

  return (
    <div className="space-y-8">
      {/* My Enrolled Lessons */}
      <div>
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Enrolled Lessons
        </h2>
        {upcomingLessons.length === 0 ? (
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-white/10">
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                You havent enrolled in any lessons yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingLessons.map((lesson) => (
              <Card
                key={lesson.id}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {lesson.title}
                    </CardTitle>
                    <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Enrolled
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {lesson.description || "No description available"}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {new Date(lesson.scheduledAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      {new Date(lesson.scheduledAt).toLocaleTimeString()} (
                      {lesson.duration || "N/A"} min)
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      {lesson.location || "Online"}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      {lesson._count.enrollments} /{" "}
                      {lesson.capacity || "Unlimited"} students
                    </div>
                  </div>
                  <div className="pt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => cancelEnrollment(lesson.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      Join Class
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Available Lessons */}
      <div>
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Available Lessons
        </h2>
        {availableLessons.length === 0 ? (
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-white/10">
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No lessons available at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {availableLessons.map((lesson) => (
              <Card
                key={lesson.id}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20"
              >
                <CardHeader>
                  <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {lesson.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    by {lesson.coach.name || lesson.coach.email}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {lesson.description || "No description available"}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {new Date(lesson.scheduledAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      {new Date(lesson.scheduledAt).toLocaleTimeString()} (
                      {lesson.duration || "N/A"} min)
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      {lesson.location || "Online"}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      {lesson._count.enrollments} /{" "}
                      {lesson.capacity || "Unlimited"} students
                    </div>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    onClick={() => enrollInLesson(lesson.id)}
                  >
                    Enroll Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
