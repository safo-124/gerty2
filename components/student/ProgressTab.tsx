"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Brain, Calendar, Trophy, Zap } from "lucide-react";

export default function ProgressTab() {
  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-xl shadow-blue-500/20">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <Trophy className="h-12 w-12 opacity-80" />
              <div>
                <p className="text-blue-100 text-sm">Current Rating</p>
                <p className="text-3xl font-bold">1450</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white border-0 shadow-xl shadow-green-500/20">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-12 w-12 opacity-80" />
              <div>
                <p className="text-green-100 text-sm">Rating Change</p>
                <p className="text-3xl font-bold">+150</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0 shadow-xl shadow-purple-500/20">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <Brain className="h-12 w-12 opacity-80" />
              <div>
                <p className="text-purple-100 text-sm">Puzzles Solved</p>
                <p className="text-3xl font-bold">47</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-600 to-orange-600 text-white border-0 shadow-xl shadow-amber-500/20">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <Calendar className="h-12 w-12 opacity-80" />
              <div>
                <p className="text-amber-100 text-sm">Lessons Taken</p>
                <p className="text-3xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <div>
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Recent Achievements
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-white/10 hover:border-amber-400 dark:hover:border-amber-500 transition-all duration-300">
            <CardContent className="py-6 text-center space-y-3">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                First Victory
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Won your first tournament match
              </p>
              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border-0">
                2 days ago
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300">
            <CardContent className="py-6 text-center space-y-3">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                Puzzle Master
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Solved 50 chess puzzles
              </p>
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200 border-0">
                1 week ago
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-white/10 hover:border-green-400 dark:hover:border-green-500 transition-all duration-300">
            <CardContent className="py-6 text-center space-y-3">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                Quick Learner
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Completed 10 lessons in one month
              </p>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200 border-0">
                2 weeks ago
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Learning Goals */}
      <div>
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Learning Goals
        </h2>
        <div className="space-y-4">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-white/10">
            <CardContent className="py-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-blue-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Master Opening Theory
                  </h3>
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border-0">
                  75% Complete
                </Badge>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-white/10">
            <CardContent className="py-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-purple-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Improve Endgame Skills
                  </h3>
                </div>
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200 border-0">
                  50% Complete
                </Badge>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: "50%" }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-white/10">
            <CardContent className="py-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-green-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Tactical Pattern Recognition
                  </h3>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200 border-0">
                  90% Complete
                </Badge>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-600 to-emerald-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: "90%" }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
