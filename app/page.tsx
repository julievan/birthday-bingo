"use client";

import { useState, useEffect } from "react";
import { getShuffledCriteria } from "@/lib/bingoCriteria";
import { checkBingo, validateNames } from "@/lib/bingoUtils";
import Link from "next/link";

export default function BingoCard() {
  const [playerName, setPlayerName] = useState("");
  const [names, setNames] = useState<string[]>([]);
  const [marked, setMarked] = useState<boolean[]>([]);
  const [criteria, setCriteria] = useState<string[]>([]);
  const [hasBingo, setHasBingo] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [cardId] = useState(() => Math.random().toString(36).substring(7));

  useEffect(() => {
    const shuffled = getShuffledCriteria();
    setCriteria(shuffled);
    setNames(Array(25).fill(""));
    setMarked(Array(25).fill(false));
  }, []);

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
    setError("");

    // Auto-mark box if name is entered, unmark if name is cleared
    const newMarked = [...marked];
    if (value.trim()) {
      newMarked[index] = true;
    } else {
      newMarked[index] = false;
    }
    setMarked(newMarked);
    setHasBingo(checkBingo(newMarked));
  };

  const handleToggle = (index: number) => {
    const newMarked = [...marked];
    newMarked[index] = !newMarked[index];
    setMarked(newMarked);
    setHasBingo(checkBingo(newMarked));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerName.trim()) {
      setError("Please enter your name at the top.");
      return;
    }

    const validationError = validateNames(names);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!hasBingo) {
      setError("You don't have a bingo yet!");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: playerName.trim(),
          names,
          marked,
          hasBingo,
          cardId,
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitted(true);
      setError("");
    } catch (err) {
      setError("Failed to submit. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-yellow-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white/80 rounded-2xl shadow-lg p-6 max-w-md w-full text-center border border-rose-200">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-stone-700 mb-4">
            Bingo Submitted!
          </h1>
          <p className="text-stone-600 mb-6">
            {playerName}, your bingo card has been submitted. Check the{" "}
            <Link
              href="/feed"
              className="text-rose-600 hover:underline font-bold"
            >
              live feed
            </Link>{" "}
            to see if you won!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-rose-300 text-white px-6 py-2 rounded-lg hover:bg-rose-400 transition"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-yellow-50 to-emerald-50 p-3 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/85 rounded-2xl shadow-lg p-4 md:p-6 border border-rose-200 backdrop-blur-sm">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-rose-600">
            Birthday Bingo 🎂
          </h1>
          <p className="text-center text-stone-600 mb-6 text-sm md:text-base">
            Find people who match the criteria and get 5 in a row to win!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Player Name Input */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent text-base bg-white"
                disabled={submitted}
              />
            </div>

            {/* Bingo Grid with Names Below Each Box */}
            <div className="grid grid-cols-5 gap-1 md:gap-2">
              {criteria.map((criterion, index) => (
                <div key={index} className="flex flex-col gap-1">
                  {/* Criteria Box */}
                  <button
                    type="button"
                    onClick={() => handleToggle(index)}
                    className={`rounded-lg p-2 md:p-3 text-center transition-all text-xs md:text-sm font-medium h-24 md:h-28 flex flex-col items-center justify-center cursor-pointer border-2 ${
                      marked[index]
                        ? "bg-gradient-to-br from-amber-100 to-rose-100 text-stone-800 border-rose-300 shadow-md scale-105"
                        : "bg-white text-stone-700 border-rose-200 hover:border-rose-300 hover:shadow-sm hover:bg-rose-50"
                    }`}
                  >
                    <span className="line-clamp-5 leading-tight">
                      {criterion}
                    </span>
                  </button>

                  {/* Name Input Below Box */}
                  <input
                    type="text"
                    value={names[index]}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    placeholder="Name"
                    className="w-full px-2 py-1 border border-rose-200 rounded text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent bg-white text-stone-700 placeholder-stone-400"
                    disabled={submitted}
                  />
                </div>
              ))}
            </div>

            {/* Bingo Status */}
            {hasBingo && (
              <div className="bg-gradient-to-r from-amber-100 to-rose-100 border-2 border-rose-300 rounded-lg p-4 text-center shadow-sm">
                <p className="text-rose-900 font-bold text-lg">🎉 BINGO! 🎉</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
                <p className="text-red-700 font-semibold text-sm md:text-base">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || submitted}
              className="w-full bg-gradient-to-r from-rose-300 to-amber-200 text-white py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:from-rose-400 hover:to-amber-300 transition disabled:from-stone-300 disabled:to-stone-300 disabled:cursor-not-allowed shadow-md"
            >
              {submitting ? "Submitting..." : "Submit Bingo"}
            </button>

            {/* Live Feed Link */}
            <div className="text-center">
              <Link
                href="/feed"
                className="text-rose-600 hover:text-rose-700 font-semibold text-sm md:text-base"
              >
                View Live Feed →
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
