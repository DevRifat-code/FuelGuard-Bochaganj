$key = Get-Content '.vercel-key.txt' -Raw
vercel env add FIREBASE_PRIVATE_KEY production --value $key --yes