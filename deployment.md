# 1-Minute Deployment Guide 🚀

## Step 1: Vercel Pe Jaao
1. [Vercel.com](https://vercel.com) kholo
2. GitHub se login karo

## Step 2: Project Upload Karo
1. "Add New" > "Project" pe click karo
2. GitHub repo select karo
3. "Import" button dabao

## Step 3: Settings Update Karo
1. Framework: "Other" select karo
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Install Command: `npm install`

## Step 4: Environment Variables Daldo
1. "Environment Variables" section mein jao
2. Ye variables add karo:
   ```
   MONGODB_URI=your_mongodb_uri
   GOOGLE_CLIENT_ID=your_google_id
   GOOGLE_CLIENT_SECRET=your_google_secret
   COOKIE_KEY=any_random_string
   NODE_ENV=production
   ```

## Step 5: Deploy! 🚀
1. "Deploy" button dabao
2. Thoda wait karo
3. Jab deploy ho jaye, mil jayegi ek URL (kuch aisa: `https://your-app.vercel.app`)

## Frontend Update Karo
1. `client/.env` file kholo
2. Is URL ko update karo:
   ```
   VITE_API_BASE_URL="https://your-app.vercel.app"
   ```
3. Frontend ko redeploy karo Render pe

## Agar Error Aaye To:
1. Vercel ke logs check karo
2. Mujhe batao, main help kar dunga! 😊

Bas itna! Ab aapka backend Vercel pe deploy ho chuka hai! 🎉
