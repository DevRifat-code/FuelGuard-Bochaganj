@echo off
echo Adding Firebase environment variables to Vercel...

vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production < .env.local
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production < .env.local
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production < .env.local
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production < .env.local
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production < .env.local
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production < .env.local
vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID production < .env.local
vercel env add JWT_SECRET production < .env.local
vercel env add FIREBASE_PROJECT_ID production < .env.local
vercel env add FIREBASE_CLIENT_EMAIL production < .env.local
vercel env add FIREBASE_PRIVATE_KEY production < .env.local

echo.
echo Environment variables added! Now redeploying...
vercel --prod

pause
