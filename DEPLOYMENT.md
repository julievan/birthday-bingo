# Quick Deployment Guide 🚀

Your Birthday Bingo app is ready to deploy! Here's how to get it live in minutes.

## Prerequisites

- A free Vercel account (sign up at [vercel.com](https://vercel.com))
- This project folder on your computer

## Easiest Way: GitHub + Vercel

### Step 1: Push to GitHub

```bash
cd birthday-bingo
git add .
git commit -m "Birthday bingo app ready for deployment"
git push origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Add GitHub Org or Personal Account" and authorize Vercel
3. Find and select the `birthday-bingo` repository
4. Click "Deploy"
5. Wait for deployment to complete (usually 1-2 minutes)
6. You'll get a live URL! 🎉

## Alternative: Vercel CLI

```bash
# Install Vercel CLI globally (one time)
npm install -g vercel

# From the birthday-bingo directory
cd birthday-bingo
vercel

# Follow the prompts and it will deploy automatically
```

## After Deployment

1. **Test it**: Click the provided Vercel URL and try filling out the card
2. **Share the link**: Send guests the main URL (e.g., `https://birthday-bingo-xxx.vercel.app`)
3. **Share the feed**: Send them the live feed URL (e.g., `https://birthday-bingo-xxx.vercel.app/feed`)

## Common Issues

**"Command not found: vercel"?**
- Make sure you ran `npm install -g vercel` first
- Restart your terminal

**Deploy fails?**
- Check that you have Node.js 18+ installed
- Make sure `.gitignore` includes `.data/` and `node_modules/`

**Live feed not updating?**
- The page auto-refreshes every 2 seconds
- Try refreshing manually (Ctrl+R or Cmd+R)

## How Guests Use It

1. Send them the main bingo card link
2. They fill in their name and find people matching the criteria
3. They click boxes to mark them as they fill names in
4. When they get a bingo (5 in a row), they click "Submit Bingo"
5. They can check the live feed to see the leaderboard!

## Tips for the Party

- **Display the feed** on a screen/TV at the party (if you have a laptop)
- **Pre-load the links** on your phone so you can quickly share them
- **Test it first** with one person to make sure everything works
- **Celebrate the winner!** 🏆

## Troubleshooting Deployment

**"Build failed"?**
1. Make sure `package.json` exists in the project root
2. Check that all dependencies are listed: `npm list`
3. Try: `npm install` then `npm run build` locally first

**"Cannot find module"?**
1. Delete `node_modules` folder
2. Run `npm install`
3. Try deploying again

**Data not saving?**
1. Vercel's free tier may reset data between deployments
2. For a party, this is fine - submissions during the party will work
3. If you need persistent storage, upgrade to Vercel Pro or use a database

## Need Help?

- Check the main README.md for more details
- Vercel's support: [vercel.com/help](https://vercel.com/help)
- This is a Next.js app, so [nextjs.org](https://nextjs.org) has great docs

Good luck at your party! 🎉
