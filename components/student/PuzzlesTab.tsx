"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Trophy, Target, Loader2, CheckCircle2 } from "lucide-react";

interface Puzzle {
  id: number;
  title: string;
  fen: string;
  difficulty: string | null;
  tags: string | null;
  assignment: {
    status: string;
    score: number | null;
  } | null;
}

export default function PuzzlesTab() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPuzzles();
  }, []);

  async function fetchPuzzles() {
    try {
      const response = await fetch("/api/student/puzzles");
      if (response.ok) {
        const data = await response.json();
        setPuzzles(data);
      }
    } catch (error) {
      console.error("Error fetching puzzles:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const assignedPuzzles = puzzles.filter(
    (p) => p.assignment && p.assignment.status === "assigned"
  );
  const completedPuzzles = puzzles.filter(
    (p) => p.assignment && p.assignment.status === "completed"
  );

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0 shadow-xl shadow-purple-500/20">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <Target className="h-12 w-12 opacity-80" />
              <div>
                <p className="text-purple-100 text-sm">Active Puzzles</p>
                <p className="text-3xl font-bold">{assignedPuzzles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white border-0 shadow-xl shadow-green-500/20">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="h-12 w-12 opacity-80" />
              <div>
                <p className="text-green-100 text-sm">Completed</p>
                <p className="text-3xl font-bold">{completedPuzzles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-600 to-orange-600 text-white border-0 shadow-xl shadow-amber-500/20">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <Trophy className="h-12 w-12 opacity-80" />
              <div>
                <p className="text-amber-100 text-sm">Total Score</p>
                <p className="text-3xl font-bold">
                  {completedPuzzles.reduce(
                    (sum, p) => sum + (p.assignment?.score || 0),
                    0
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Puzzles */}
      <div>
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Active Puzzles
        </h2>
        {assignedPuzzles.length === 0 ? (
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-white/10">
            <CardContent className="py-12 text-center">
              <Brain className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No active puzzles assigned yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedPuzzles.map((puzzle) => (
              <Card
                key={puzzle.id}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {puzzle.title}
                    </CardTitle>
                    {puzzle.difficulty && (
                      <Badge
                        variant={
                          puzzle.difficulty === "Easy"
                            ? "default"
                            : puzzle.difficulty === "Medium"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {puzzle.difficulty}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 aspect-square flex items-center justify-center">
                    <Brain className="h-16 w-16 text-purple-600" />
                  </div>
                  {puzzle.tags && (
                    <div className="flex flex-wrap gap-2">
                      {puzzle.tags.split(",").map((tag, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800"
                        >
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    Solve Puzzle
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Puzzles */}
      {completedPuzzles.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Completed Puzzles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedPuzzles.map((puzzle) => (
              <Card
                key={puzzle.id}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-white/10 opacity-75"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-gray-700 dark:text-gray-300">
                      {puzzle.title}
                    </CardTitle>
                    <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {puzzle.assignment?.score || 0} pts
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 aspect-square flex items-center justify-center">
                    <Trophy className="h-16 w-16 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
