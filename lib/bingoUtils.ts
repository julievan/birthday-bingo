export interface BingoCard {
  playerName: string;
  names: string[];
  marked: boolean[];
}

export interface Submission {
  id: string;
  playerName: string;
  timestamp: number;
  names: string[];
  marked: boolean[];
  hasBingo: boolean;
}

export function checkBingo(marked: boolean[]): boolean {
  // Convert 1D array to 5x5 grid
  const grid: boolean[][] = [];
  for (let i = 0; i < 5; i++) {
    grid.push(marked.slice(i * 5, (i + 1) * 5));
  }

  // Check rows
  for (let i = 0; i < 5; i++) {
    if (grid[i].every(cell => cell)) return true;
  }

  // Check columns
  for (let i = 0; i < 5; i++) {
    if (grid.every(row => row[i])) return true;
  }

  // Check diagonals
  if (grid.every((row, i) => row[i])) return true;
  if (grid.every((row, i) => row[4 - i])) return true;

  return false;
}

export function validateNames(names: string[]): string | null {
  const firstNameMap = new Map<string, number[]>();

  for (let i = 0; i < names.length; i++) {
    const name = names[i].trim();
    if (!name) continue;

    const firstName = name.split(/\s+/)[0].toLowerCase();
    if (!firstNameMap.has(firstName)) {
      firstNameMap.set(firstName, []);
    }
    firstNameMap.get(firstName)!.push(i);
  }

  // Check for duplicate full names and first names without last names
  for (const [firstName, indices] of firstNameMap) {
    if (indices.length > 1) {
      for (const idx of indices) {
        const parts = names[idx].trim().split(/\s+/);
        if (parts.length === 1) {
          return `Duplicate first name "${firstName}" found. Please use full names (first + last) to disambiguate.`;
        }
      }

      // Check if any exact duplicates
      const fullNames = indices.map(i => names[i].toLowerCase().trim());
      if (new Set(fullNames).size < fullNames.length) {
        return "You have entered the same name twice.";
      }
    }
  }

  return null;
}
