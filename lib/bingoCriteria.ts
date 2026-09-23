export const BINGO_CRITERIA = [
  "has a shoe size lower than size 6 womens",
  "works at a startup",
  "has been to a harry styles concert",
  "has been to 131 mccormack",
  "has met / run into charlie heaton in the last 3 weeks",
  "has been to dear darling for steak frites",
  "has done the ha giang loop in vietnam",
  "is wearing a matching pajama set",
  "has been to lunch lady on ossington",
  "uses milky toner in their skincare routine",
  "is wearing contact lenses right now",
  "is going to the harry styles concert(s) in toronto in may",
  "is a consultant",
  "has been to winnipeg",
  "works in b2b ai saas :(",
  "owns a kindle",
  "has a foot fetish (find micah)",
  "has their nails done",
  "signed up for the harry styles presale for julie 2 weeks ago (don't lie julie will verify with her spreadsheet)",
  "does not live in toronto / GTA or JUST moved here",
  "name starts with a J",
  "went to stampede or osheaga this year",
  "is NOT born in 2001",
  "has been in a car accident",
  "is carrying a lip balm on them today",
];

export function getShuffledCriteria(seed?: number): string[] {
  const criteria = [...BINGO_CRITERIA];
  const rng = seed !== undefined ? mulberry32(seed) : Math.random;

  for (let i = criteria.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [criteria[i], criteria[j]] = [criteria[j], criteria[i]];
  }

  return criteria;
}

function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function generateCardId(): string {
  return Math.random().toString(36).substring(7);
}
