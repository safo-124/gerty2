"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  UserCircle,
  Mail,
  Calendar,
  Award,
  Loader2,
  MessageSquare,
} from "lucide-react";

interface Coach {
  id: number;
  name: string | null;
  email: string;
  coachProfile: {
    bio: string | null;
    rating: number | null;
    availability: string | null;
  } | null;
}

export default function MyCoachTab() {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoach();
  }, []);

  async function fetchCoach() {
    try {
      const response = await fetch("/api/student/coach");
      if (response.ok) {
        const data = await response.json();
        setCoach(data);
      }
    } catch (error) {
      console.error("Error fetching coach:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!coach) {
    return (
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-white/10">
        <CardContent className="py-12 text-center space-y-4">
          <UserCircle className="h-16 w-16 mx-auto text-gray-400" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              No Coach Assigned Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You don&apos;t have a coach assigned to you yet. Browse our
              coaches and request one!
            </p>
            <Button
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              onClick={() => (window.location.href = "/coaches")}
            >
              Browse Coaches
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Coach Profile Card */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 shadow-xl shadow-green-500/10">
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Your Coach
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-green-600">
              <AvatarFallback className="bg-gradient-to-br from-green-600 to-emerald-600 text-white text-2xl">
                {coach.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "C"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {coach.name || "Coach"}
                </h3>
                {coach.coachProfile?.rating && (
                  <div className="flex items-center gap-2 mt-1">
                    <Award className="h-5 w-5 text-amber-600" />
                    <span className="text-lg font-semibold text-amber-600">
                      Rating: {coach.coachProfile.rating}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{coach.email}</span>
                </div>
                {coach.coachProfile?.availability && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Calendar className="h-4 w-4" />
                    <Badge variant="outline" className="text-xs">
                      {coach.coachProfile.availability}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {coach.coachProfile?.bio && (
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                About
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {coach.coachProfile.bio}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message Coach
            </Button>
            <Button variant="outline" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Lesson
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-white/10">
          <CardContent className="py-6 text-center">
            <Calendar className="h-10 w-10 mx-auto text-green-600 mb-3" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Lessons This Month
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              5
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-white/10">
          <CardContent className="py-6 text-center">
            <MessageSquare className="h-10 w-10 mx-auto text-blue-600 mb-3" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Messages
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              12
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-white/10">
          <CardContent className="py-6 text-center">
            <Award className="h-10 w-10 mx-auto text-amber-600 mb-3" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Improvement
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              +150
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
