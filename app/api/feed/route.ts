import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SUBMISSIONS_FILE = path.join(process.cwd(), ".data", "submissions.json");

function getSubmissions() {
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lastTimestamp = parseInt(searchParams.get("since") || "0", 10);

  const submissions = getSubmissions();
  const newSubmissions = submissions.filter((s: any) => s.timestamp > lastTimestamp);

  return NextResponse.json({
    submissions: submissions.sort((a: any, b: any) => a.timestamp - b.timestamp),
    newSubmissions,
  });
}
