# Birthday Bingo 🎂

An interactive bingo card web app for birthday parties! Guests fill in names of people who match criteria, mark off squares, and the first person to get a bingo wins. Features real-time live feed tracking for all submissions.

## Features

✅ **Interactive Bingo Card** - Click to mark squares, see instant visual feedback  
✅ **Name Validation** - Prevent duplicate names; auto-require last names if first names match  
✅ **Bingo Detection** - Automatically detects 5-in-a-row (horizontal, vertical, diagonal)  
✅ **Live Feed** - Real-time submission tracking visible to all guests  
✅ **Mobile Optimized** - Full responsive design, perfect for phones  
✅ **No Backend Database** - Uses file-based storage, auto-cleans data after 24 hours  

## How to Play

1. **Fill in your name** at the top of the card
2. **Find people** who match each criteria and write their names in the boxes
3. **Click boxes** to mark them when you've filled them in
4. **Get 5 in a row** (horizontal, vertical, or diagonal) to get a bingo
5. **Submit** your card - first one to submit with a valid bingo wins!
6. **View Live Feed** to see who submitted and who won

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

```bash
npm install -g vercel
vercel
```

Follow the prompts to connect your project and deploy.

### Option 2: Deploy via GitHub

1. Push this project to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repo
5. Click "Deploy"

Vercel will automatically detect it's a Next.js project and configure everything.

### Option 3: Deploy via Vercel Web UI

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Add GitHub Org or Personal Account" and authorize
3. Select this repository
4. Click "Deploy"

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

- **Bingo Card**: `http://localhost:3000`
- **Live Feed**: `http://localhost:3000/feed`

## How It Works

- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes
- **Storage**: File-based JSON storage in `.data/submissions.json`
- **Auto-cleanup**: Submissions older than 24 hours are automatically removed
- **Real-time Updates**: Live feed refreshes every 2 seconds

## Customization

Edit the criteria in `lib/bingoCriteria.ts`:

```typescript
export const BINGO_CRITERIA = [
  "your custom criteria here",
  // ... add 25 total
];
```

The criteria will be randomly shuffled each time the page loads.

## Features Details

### Validation

- **No empty squares** - All 25 boxes must have names
- **No exact duplicates** - Same name can't appear twice
- **Smart first-name matching** - If "Sarah" appears twice, you must use "Sarah Smith" for at least one
- **Required for submission** - Must have your name filled in and a valid bingo

### Bingo Patterns

The app detects:
- ✅ All 5 boxes in any horizontal row
- ✅ All 5 boxes in any vertical column  
- ✅ All 5 boxes in diagonal (top-left to bottom-right)
- ✅ All 5 boxes in diagonal (top-right to bottom-left)

### Live Feed

- Shows submissions in order
- Highlights the winner 👑
- Auto-refreshes every 2 seconds
- Mobile-friendly interface

## Data Storage

Submissions are stored in `.data/submissions.json` on the server. This file:
- Is created automatically on first submission
- Contains player names, timestamps, and which boxes they marked
- Auto-deletes entries older than 24 hours
- Is not committed to git (in .gitignore)

## Troubleshooting

**"No submissions yet" on live feed?**
- Make sure the bingo card form was submitted successfully
- Check that you got a valid bingo before submitting

**"You don't have a bingo yet"?**
- You need exactly 5 marked boxes in a row (horizontal, vertical, or diagonal)
- Click on boxes to mark them (they turn green)

**Names not saving?**
- Make sure you click on the box first to mark it
- Then fill in the name field below that box

## Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (free tier works!)
- **Storage**: File system (no database needed)

## License

Enjoy! 🎉
