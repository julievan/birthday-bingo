"use client";

import { useState, useEffect } from "react";
import { type Submission } from "@/lib/bingoUtils";
import Link from "next/link";

export default function LiveFeed() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [winner, setWinner] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(Date.now());

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`/api/feed?since=${lastFetch}`);
        const data = await response.json();
        
        const sortedSubmissions = data.submissions.sort(
          (a: Submission, b: Submission) => a.timestamp - b.timestamp
        );
        
        setSubmissions(sortedSubmissions);
        
        const winnerSub = sortedSubmissions.find((s: Submission) => s.hasBingo);
        if (winnerSub && !winner) {
          setWinner(winnerSub);
        }
        
        setLoading(false);
        setLastFetch(Date.now());
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
        setLoading(false);
      }
    };

    fetchSubmissions();
    const interval = setInterval(fetchSubmissions, 2000);
    return () => clearInterval(interval);
  }, [lastFetch, winner]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-rose-50 p-3 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/85 rounded-2xl shadow-lg p-4 md:p-6 border border-rose-200 backdrop-blur-sm">
          <Link
            href="/"
            className="text-rose-600 hover:text-rose-700 font-semibold text-sm mb-4 inline-block"
          >
            ← Back to Bingo Card
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-rose-600">
            Live Feed 📊
          </h1>
          <p className="text-center text-stone-600 mb-6 text-sm md:text-base">
            Watch in real-time as people submit their bingo cards!
          </p>

          {winner && (
            <div className="bg-gradient-to-r from-amber-100 via-rose-100 to-pink-100 border-2 border-rose-300 rounded-lg p-4 md:p-6 mb-6 text-center shadow-md">
              <div className="text-4xl md:text-5xl mb-2">👑</div>
              <h2 className="text-xl md:text-2xl font-bold text-stone-800">
                {winner.playerName}
              </h2>
              <p className="text-stone-700 font-semibold text-sm md:text-base">
                Got BINGO first! 🎉
              </p>
              <p className="text-xs md:text-sm text-stone-600 mt-2">
                {new Date(winner.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-stone-600 animate-pulse text-sm md:text-base">
                Loading submissions...
              </p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-stone-600 text-base md:text-lg">
                No submissions yet. Go play bingo! 🎮
              </p>
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {submissions.map((submission, index) => (
                <div
                  key={submission.id}
                  className={`p-3 md:p-4 rounded-lg border-2 transition-all ${
                    submission.hasBingo
                      ? "bg-gradient-to-r from-amber-100 to-rose-100 border-rose-300"
                      : "bg-sky-50 border-rose-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <div className="text-xl md:text-2xl font-bold text-rose-300 flex-shrink-0 w-6 md:w-8">
                        #{index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-base md:text-lg text-stone-800 truncate">
                          {submission.playerName}
                        </p>
                        <p className="text-xs md:text-sm text-stone-600">
                          {new Date(submission.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    {submission.hasBingo && (
                      <div className="text-xl md:text-2xl flex-shrink-0">🎉</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 md:mt-8 text-center text-xs md:text-sm text-stone-600">
            Page auto-refreshes every 2 seconds
          </div>
        </div>
      </div>
    </div>
  );
}
