import { NextRequest, NextResponse } from "next/server";
import { checkBingo, type Submission } from "@/lib/bingoUtils";
import fs from "fs";
import path from "path";

const SUBMISSIONS_FILE = path.join(process.cwd(), ".data", "submissions.json");

function ensureDataDir() {
  const dir = path.dirname(SUBMISSIONS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getSubmissions(): Submission[] {
  ensureDataDir();
  if (!fs.existsSync(SUBMISSIONS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveSubmissions(submissions: Submission[]) {
  ensureDataDir();
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
}

function cleanOldSubmissions(submissions: Submission[]) {
  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
  return submissions.filter(s => s.timestamp > twentyFourHoursAgo);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerName, names, marked, cardId } = body;

    if (!playerName || !Array.isArray(names) || !Array.isArray(marked)) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const hasBingo = checkBingo(marked);
    if (!hasBingo) {
      return NextResponse.json(
        { error: "No bingo detected" },
        { status: 400 }
      );
    }

    const submission: Submission = {
      id: cardId,
      playerName,
      timestamp: Date.now(),
      names,
      marked,
      hasBingo: true,
    };

    let submissions = getSubmissions();
    submissions = cleanOldSubmissions(submissions);

    // Check if this card ID already submitted
    if (submissions.some(s => s.id === cardId)) {
      return NextResponse.json(
        { error: "This card has already been submitted" },
        { status: 400 }
      );
    }

    submissions.push(submission);
    saveSubmissions(submissions);

    return NextResponse.json({
      success: true,
      placement: submissions.filter(s => s.hasBingo).length,
      submission,
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
