"use client";

import { useState, useEffect } from "react";
import { type Submission } from "@/lib/bingoUtils";
import { getShuffledCriteria } from "@/lib/bingoCriteria";
import Link from "next/link";

const ginghamStyle = {
  backgroundImage: `
    linear-gradient(90deg, 
      #f5e6d3 0%, #f5e6d3 20%, 
      #d4e4f7 20%, #d4e4f7 40%, 
      #f5e6d3 40%, #f5e6d3 60%, 
      #e8d5c4 60%, #e8d5c4 80%, 
      #f5e6d3 80%, #f5e6d3 100%
    ),
    linear-gradient(0deg, 
      #f5e6d3 0%, #f5e6d3 20%, 
      #e8d5c4 20%, #e8d5c4 40%, 
      #f5e6d3 40%, #f5e6d3 60%, 
      #d4e4f7 60%, #d4e4f7 80%, 
      #f5e6d3 80%, #f5e6d3 100%
    )
  `,
  backgroundSize: "100px 100px",
  backgroundColor: "#faf8f3",
};

export default function LiveFeed() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [winner, setWinner] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(Date.now());
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [criteria, setCriteria] = useState<string[]>([]);

  useEffect(() => {
    const shuffled = getShuffledCriteria();
    setCriteria(shuffled);
  }, []);

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

  if (selectedSubmission && criteria.length > 0) {
    return (
      <div className="min-h-screen p-3 md:p-6" style={ginghamStyle}>
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/95 rounded-2xl shadow-lg p-4 md:p-6 border-2" style={{ borderColor: "#e8d5c4" }}>
            <button
              onClick={() => setSelectedSubmission(null)}
              className="mb-4 font-semibold text-sm hover:underline"
              style={{ color: "#c97a8a" }}
            >
              ← Back to Feed
            </button>

            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2" style={{ color: "#c97a8a" }}>
              {selectedSubmission.playerName}'s Card
            </h1>
            <p className="text-center mb-6 text-sm" style={{ color: "#7a8a8a" }}>
              Submitted at {new Date(selectedSubmission.timestamp).toLocaleTimeString()}
            </p>

            {/* Bingo Grid */}
            <div className="grid grid-cols-5 gap-1 md:gap-2 mb-6">
              {criteria.map((criterion, index) => (
                <div key={index} className="flex flex-col gap-1">
                  {/* Criteria Box */}
                  <div
                    className="rounded-lg p-2 md:p-3 text-center text-xs md:text-sm font-medium h-28 md:h-32 flex flex-col items-center justify-center border-2 overflow-hidden"
                    style={{
                      backgroundColor: selectedSubmission.marked[index] ? "#f0d5c4" : "#faf8f3",
                      borderColor: selectedSubmission.marked[index] ? "#d9b8a8" : "#e8d5c4",
                      color: "#5a7a7a",
                    }}
                  >
                    <span className="leading-tight text-center">
                      {criterion}
                    </span>
                  </div>

                  {/* Name */}
                  <div
                    className="px-2 py-1 rounded text-xs md:text-sm border-2 bg-white text-center"
                    style={{
                      borderColor: "#d5c4b8",
                      color: "#5a7a7a",
                    }}
                  >
                    {selectedSubmission.names[index] || "—"}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="font-semibold text-sm md:text-base hover:underline"
                style={{ color: "#c97a8a" }}
              >
                Back to Feed
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 md:p-6" style={ginghamStyle}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/95 rounded-2xl shadow-lg p-4 md:p-6 border-2" style={{ borderColor: "#e8d5c4" }}>
          <Link
            href="/"
            className="font-semibold text-sm mb-4 inline-block hover:underline"
            style={{ color: "#c97a8a" }}
          >
            ← Back to Bingo Card
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2" style={{ color: "#c97a8a" }}>
            Live Feed 📊
          </h1>
          <p className="text-center mb-6 text-sm md:text-base" style={{ color: "#7a8a8a" }}>
            Watch in real-time as people submit their bingo cards! Click to verify.
          </p>

          {winner && (
            <div className="rounded-lg p-4 md:p-6 mb-6 text-center border-2" style={{ backgroundColor: "#f0e6d3", borderColor: "#d9b8a8" }}>
              <div className="text-4xl md:text-5xl mb-2">👑</div>
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#5a7a7a" }}>
                {winner.playerName}
              </h2>
              <p className="font-semibold text-sm md:text-base" style={{ color: "#7a8a8a" }}>
                Got BINGO first! 🎉
              </p>
              <p className="text-xs md:text-sm mt-2" style={{ color: "#7a8a8a" }}>
                {new Date(winner.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-sm md:text-base animate-pulse" style={{ color: "#7a8a8a" }}>
                Loading submissions...
              </p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-base md:text-lg" style={{ color: "#7a8a8a" }}>
                No submissions yet. Go play bingo! 🎮
              </p>
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {submissions.map((submission, index) => (
                <button
                  key={submission.id}
                  onClick={() => setSelectedSubmission(submission)}
                  className="w-full text-left p-3 md:p-4 rounded-lg border-2 transition-all hover:shadow-md"
                  style={{
                    backgroundColor: submission.hasBingo ? "#f0d5c4" : "#f9f7f3",
                    borderColor: submission.hasBingo ? "#d9b8a8" : "#e8d5c4",
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <div className="text-xl md:text-2xl font-bold flex-shrink-0 w-6 md:w-8" style={{ color: "#c97a8a" }}>
                        #{index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-base md:text-lg truncate" style={{ color: "#5a7a7a" }}>
                          {submission.playerName}
                        </p>
                        <p className="text-xs md:text-sm" style={{ color: "#7a8a8a" }}>
                          {new Date(submission.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {submission.hasBingo && (
                        <div className="text-xl md:text-2xl">🎉</div>
                      )}
                      <span style={{ color: "#c97a8a" }}>→</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 md:mt-8 text-center text-xs md:text-sm" style={{ color: "#7a8a8a" }}>
            Page auto-refreshes every 2 seconds
          </div>
        </div>
      </div>
    </div>
  );
}
