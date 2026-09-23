# Project Structure

## Key Files

### Frontend Pages
- **`app/page.tsx`** - Main bingo card form (what guests see)
- **`app/feed/page.tsx`** - Live feed page (what you & guests see for leaderboard)
- **`app/layout.tsx`** - Main layout wrapper
- **`app/globals.css`** - Global styles

### Backend API
- **`app/api/submit/route.ts`** - POST endpoint to submit bingo cards
  - Validates bingo (5 in a row)
  - Stores submission with timestamp
  - Returns placement number
  
- **`app/api/feed/route.ts`** - GET endpoint to fetch submissions
  - Returns all submissions sorted by timestamp
  - Returns only new submissions since last fetch

### Utilities
- **`lib/bingoCriteria.ts`** - The 25 criteria for bingo
  - `BINGO_CRITERIA` array with all criteria
  - `getShuffledCriteria()` - randomly shuffles criteria
  - `generateCardId()` - unique ID for each card
  
- **`lib/bingoUtils.ts`** - Core game logic
  - `checkBingo()` - detects 5-in-a-row
  - `validateNames()` - prevents duplicates & enforces naming rules

### Config Files
- **`package.json`** - Dependencies and scripts
- **`tsconfig.json`** - TypeScript config
- **`tailwind.config.ts`** - Tailwind CSS setup
- **`next.config.ts`** - Next.js configuration
- **`.gitignore`** - Files to exclude from git

### Data Storage
- **`.data/submissions.json`** - Auto-created file where submissions are stored
  - Created on first submission
  - Auto-cleaned after 24 hours
  - Not committed to git

### Documentation
- **`README.md`** - Full documentation
- **`DEPLOYMENT.md`** - Step-by-step deployment guide
- **`PROJECT_STRUCTURE.md`** - This file

## How Data Flows

### Submission Flow
```
Guest fills form
    ↓
Clicks "Submit Bingo"
    ↓
Frontend validates (no duplicates, valid bingo)
    ↓
POST to /api/submit
    ↓
Backend validates again + checks bingo
    ↓
Stores in .data/submissions.json with timestamp
    ↓
Returns success
    ↓
Guest sees "Bingo Submitted!" message
```

### Live Feed Flow
```
Guest visits /feed
    ↓
GET /api/feed endpoint
    ↓
Reads .data/submissions.json
    ↓
Sorts by timestamp
    ↓
Returns to frontend
    ↓
Frontend displays leaderboard
    ↓
Auto-refreshes every 2 seconds
```

## Customization Guide

### Change the Criteria
Edit `lib/bingoCriteria.ts`:
```typescript
export const BINGO_CRITERIA = [
  "your new criteria 1",
  "your new criteria 2",
  // ... add exactly 25 total
];
```

### Change Colors
Edit Tailwind classes in component files:
- Bingo card uses `from-purple-600 to-pink-500` gradient
- Live feed uses `from-blue-600 to-cyan-500` gradient
- Change to any Tailwind colors

### Change Storage Duration
In `app/api/submit/route.ts`, find:
```typescript
const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
```
Change `24` to desired hours.

### Add a Database
Currently uses file storage. To use a database:
1. Replace file read/write logic in `app/api/submit/route.ts` and `app/api/feed/route.ts`
2. Use Vercel Postgres, MongoDB, or any database
3. Update queries to match your DB schema

## Deployment Notes

### On Vercel
- Free tier includes file system access (but resets on redeploy)
- For persistent data, use Vercel Postgres (free tier available)
- Environment variables: none required (but can add if needed)

### Data Persistence
- Current setup: submissions persist for 24 hours during party
- For multi-day persistence: add a database
- For testing: submissions stored in `.data/submissions.json` in your project root

## Testing

### Local Testing
```bash
npm run dev
# Visit http://localhost:3000
```

### Test Bingo Detection
1. Fill in name and any names in boxes
2. Click 5 boxes in a row (any direction)
3. Should see green highlight + "BINGO!" message

### Test Live Feed
1. One tab: http://localhost:3000/feed
2. Another tab: http://localhost:3000
3. Fill form and submit
4. Live feed tab should update in ~2 seconds

### Test Mobile
```bash
npm run dev
# Visit from phone on same network: http://your-ip:3000
# Or use mobile emulation in browser dev tools
```

## File Sizes

- Project: ~50MB (mostly node_modules)
- Source code: ~50KB
- Bundle size: ~100KB (gzipped)

## Performance

- First load: ~2s (mobile)
- Bingo detection: instant
- Live feed refresh: 2 second interval
- Fully mobile-friendly

Enjoy your party! 🎉
