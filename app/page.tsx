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
  const [fieldErrors, setFieldErrors] = useState<Record<number, string>>({});
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

    // Check if this name matches the player's own name
    const newErrors = { ...fieldErrors };
    if (value.trim().toLowerCase() === playerName.trim().toLowerCase()) {
      newErrors[index] = "You can't use your own name!";
    } else {
      delete newErrors[index];
    }
    setFieldErrors(newErrors);

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

    // Check for field errors
    if (Object.keys(fieldErrors).length > 0) {
      setError("Please fix the errors below before submitting.");
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
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: "linear-gradient(45deg, #f5e6d3 25%, transparent 25%, transparent 75%, #f5e6d3 75%, #f5e6d3), linear-gradient(45deg, #f5e6d3 25%, transparent 25%, transparent 75%, #f5e6d3 75%, #f5e6d3)", backgroundSize: "60px 60px", backgroundPosition: "0 0, 30px 30px", backgroundColor: "#faf8f3" }}>
        <div className="bg-white/90 rounded-2xl shadow-xl p-6 max-w-md w-full text-center border-2" style={{ borderColor: "#e8d5c4" }}>
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: "#c97a8a" }}>
            Bingo Submitted!
          </h1>
          <p className="mb-6" style={{ color: "#7a8a8a" }}>
            {playerName}, your bingo card has been submitted. Check the{" "}
            <Link
              href="/feed"
              className="font-bold hover:underline"
              style={{ color: "#c97a8a" }}
            >
              live feed
            </Link>{" "}
            to see if you won!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg transition text-white font-semibold"
            style={{ backgroundColor: "#c97a8a" }}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 md:p-6" style={{ backgroundImage: "linear-gradient(45deg, #f5e6d3 25%, transparent 25%, transparent 75%, #f5e6d3 75%, #f5e6d3), linear-gradient(45deg, #f5e6d3 25%, transparent 25%, transparent 75%, #f5e6d3 75%, #f5e6d3), linear-gradient(45deg, #e8d5c4 25%, transparent 25%, transparent 75%, #e8d5c4 75%, #e8d5c4), linear-gradient(45deg, #e8d5c4 25%, transparent 25%, transparent 75%, #e8d5c4 75%, #e8d5c4)", backgroundSize: "60px 60px, 60px 60px, 120px 120px, 120px 120px", backgroundPosition: "0 0, 30px 30px, 0 0, 30px 30px", backgroundColor: "#faf8f3" }}>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/95 rounded-2xl shadow-lg p-4 md:p-6 border-2" style={{ borderColor: "#e8d5c4" }}>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2" style={{ color: "#c97a8a" }}>
            Birthday Bingo 🎂
          </h1>
          <p className="text-center mb-6 text-sm md:text-base" style={{ color: "#7a8a8a" }}>
            Find people who match the criteria and get 5 in a row to win!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Player Name Input */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#5a7a7a" }}>
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 text-base bg-white"
                style={{ borderColor: "#d5c4b8", color: "#5a7a7a" }}
                onFocus={(e) => e.target.style.borderColor = "#c97a8a"}
                onBlur={(e) => e.target.style.borderColor = "#d5c4b8"}
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
                    className={`rounded-lg p-2 md:p-3 text-center transition-all text-xs md:text-sm font-medium h-28 md:h-32 flex flex-col items-center justify-center cursor-pointer border-2 overflow-hidden`}
                    style={{
                      backgroundColor: marked[index] ? "#f0d5c4" : "#faf8f3",
                      borderColor: marked[index] ? "#d9b8a8" : "#e8d5c4",
                      color: "#5a7a7a",
                    }}
                  >
                    <span className="leading-tight text-center">
                      {criterion}
                    </span>
                  </button>

                  {/* Name Input Below Box */}
                  <div>
                    <input
                      type="text"
                      value={names[index]}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      placeholder="Name"
                      className="w-full px-2 py-1 border-2 rounded text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white"
                      style={{
                        borderColor: fieldErrors[index] ? "#d9534f" : "#d5c4b8",
                        color: "#5a7a7a",
                      }}
                      onFocus={(e) => {
                        if (!fieldErrors[index]) e.target.style.borderColor = "#c97a8a";
                      }}
                      onBlur={(e) => {
                        if (!fieldErrors[index]) e.target.style.borderColor = "#d5c4b8";
                      }}
                      disabled={submitted}
                    />
                    {fieldErrors[index] && (
                      <p className="text-xs mt-1 text-red-600">{fieldErrors[index]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bingo Status */}
            {hasBingo && (
              <div className="rounded-lg p-4 text-center border-2" style={{ backgroundColor: "#f0e6d3", borderColor: "#d9b8a8" }}>
                <p className="font-bold text-lg" style={{ color: "#c97a8a" }}>🎉 BINGO! 🎉</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="border-2 rounded-lg p-4" style={{ backgroundColor: "#ffe6e6", borderColor: "#d9534f" }}>
                <p className="font-semibold text-sm md:text-base" style={{ color: "#c13832" }}>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || submitted}
              className="w-full text-white py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition disabled:cursor-not-allowed"
              style={{
                backgroundColor: submitting || submitted ? "#a8a8a8" : "#c97a8a",
              }}
              onMouseEnter={(e) => {
                if (!submitting && !submitted) e.currentTarget.style.backgroundColor = "#b56a7a";
              }}
              onMouseLeave={(e) => {
                if (!submitting && !submitted) e.currentTarget.style.backgroundColor = "#c97a8a";
              }}
            >
              {submitting ? "Submitting..." : "Submit Bingo"}
            </button>

            {/* Live Feed Link */}
            <div className="text-center">
              <Link
                href="/feed"
                className="font-semibold text-sm md:text-base hover:underline"
                style={{ color: "#c97a8a" }}
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
