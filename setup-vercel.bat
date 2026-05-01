@echo off
echo ========================================
echo FuelGuard Bochaganj - Vercel Setup
echo ========================================
echo.

echo Checking Vercel CLI...
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    call npm install -g vercel
)

echo.
echo Please login to Vercel (browser will open):
call vercel login

echo.
echo Linking project...
call vercel link --yes

echo.
echo Adding environment variables...
echo.

echo Adding NEXT_PUBLIC_FIREBASE_API_KEY...
echo AIzaSyBnLN4HprmXCfCOh4IIfIoeoA8WJpIo9kA | vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
echo AIzaSyBnLN4HprmXCfCOh4IIfIoeoA8WJpIo9kA | vercel env add NEXT_PUBLIC_FIREBASE_API_KEY preview
echo AIzaSyBnLN4HprmXCfCOh4IIfIoeoA8WJpIo9kA | vercel env add NEXT_PUBLIC_FIREBASE_API_KEY development

echo Adding NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN...
echo fuelguard-bochaganj.firebaseapp.com | vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
echo fuelguard-bochaganj.firebaseapp.com | vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN preview
echo fuelguard-bochaganj.firebaseapp.com | vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN development

echo Adding NEXT_PUBLIC_FIREBASE_PROJECT_ID...
echo fuelguard-bochaganj | vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
echo fuelguard-bochaganj | vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID preview
echo fuelguard-bochaganj | vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID development

echo Adding NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET...
echo fuelguard-bochaganj.firebasestorage.app | vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
echo fuelguard-bochaganj.firebasestorage.app | vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET preview
echo fuelguard-bochaganj.firebasestorage.app | vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET development

echo Adding NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID...
echo 1060481740844 | vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
echo 1060481740844 | vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID preview
echo 1060481740844 | vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID development

echo Adding NEXT_PUBLIC_FIREBASE_APP_ID...
echo 1:1060481740844:web:caf45fadbce72459962189 | vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
echo 1:1060481740844:web:caf45fadbce72459962189 | vercel env add NEXT_PUBLIC_FIREBASE_APP_ID preview
echo 1:1060481740844:web:caf45fadbce72459962189 | vercel env add NEXT_PUBLIC_FIREBASE_APP_ID development

echo Adding NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID...
echo G-GJHZ7M2VB6 | vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID production
echo G-GJHZ7M2VB6 | vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID preview
echo G-GJHZ7M2VB6 | vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID development

echo Adding JWT_SECRET...
echo fuelguard-uno-setabganj-secret-key-2026 | vercel env add JWT_SECRET production
echo fuelguard-uno-setabganj-secret-key-2026 | vercel env add JWT_SECRET preview
echo fuelguard-uno-setabganj-secret-key-2026 | vercel env add JWT_SECRET development

echo Adding FIREBASE_PROJECT_ID...
echo fuelguard-bochaganj | vercel env add FIREBASE_PROJECT_ID production
echo fuelguard-bochaganj | vercel env add FIREBASE_PROJECT_ID preview
echo fuelguard-bochaganj | vercel env add FIREBASE_PROJECT_ID development

echo Adding FIREBASE_CLIENT_EMAIL...
echo firebase-adminsdk-fbsvc@fuelguard-bochaganj.iam.gserviceaccount.com | vercel env add FIREBASE_CLIENT_EMAIL production
echo firebase-adminsdk-fbsvc@fuelguard-bochaganj.iam.gserviceaccount.com | vercel env add FIREBASE_CLIENT_EMAIL preview
echo firebase-adminsdk-fbsvc@fuelguard-bochaganj.iam.gserviceaccount.com | vercel env add FIREBASE_CLIENT_EMAIL development

echo Adding FIREBASE_PRIVATE_KEY...
echo -----BEGIN PRIVATE KEY-----^nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCk0HfWxpT6vbkL^ nWm7UAT1VpHv+t7e9MstvoHDGLPCCvdcFt0VEaO0yRS6sAMDyj23fYwgN6WwI9de4^ nQaRhFi95NNnIzsOizzjauZ3naTK90gYEk7W4AKQBzNe4CcKHEkDk8knFI3Y6tJcn^ nWGAohJW6VEt5mJsVszwfOFKzBqwVXGP2SuGJadn1HlK7qt+MmIwdLTwPVkbAMA2S^ n9Gv6r/MQobzFhN0Laq+r4ZN3cNT3Wz/zTLc15NlrAGq1EnguZGP6Ly+mHwLv+W39^ nfLh4kqqTWy+W6PqvFLe0vh0iq2YQa/HvLP+6EUho5Lbj7X3iN5Ct0yabc7kne+e6^ nnwCK3oQhAgMBAAECggEAFdPUIzoujdyljqbd6a72WArOLyhWqbR58+EsPlrCSZZp^ nzUR95Hb+/vrhmP8KjrVHKGAdt3X0DGW+uZTb982v4N4Kf8k+aKgIEBOoIXcxtKkF^ nigKj/Of80I43/ZQxUqEsvgWGlpjBNjonkJroNUWF7OTwD/0RgPi5XCsh7LrT/IoG^ n9NeLjPoIQZZwMzwHqn07WQY3fKPeqUog+p9p6yBj45AyMlnqNavbFW/8YfGtz6OJ^ ncYRfXzhvufFwyLzMUNt0c3wk1ABWC2Eqjg6PxciqoTYtMzI76m1X52VAgV3VGik8^ nz/KlgUOvOPFiknMG/ZnVsOHCZeJVQy2B89Bj/JsF/wKBgQDUaxDvVIG3fT3wJO9R^ np7Y8bNrnv+1Ph8UdgTVWCh0qRYa/gNOba3gkDbgdEm+Dtc4T+QQQrhKewMAYQek9^ nMs1x271JOt948+u59p8SVy5ci3cQePkx9CgDctN0zHBWLNsczuOK6qxL2bVqEScq^ n1fUZhOL3T2yVPZO9qFcZJSSyrwKBgQDGoRT6QhLhZjQRbcW32Y+goTBZ3AQR5Mqc^ nZmKHpBWUGjF06Zv1la5rbiwBHFA86PflcHXH4uvn68TdbI1CqV1r/j+huKcFJgDv^ nFWN4yWkhN5M8FaaLlS2r37lQ0oMD+SVas9m/BYqT+1bHRpzP8JV8FEOLI7dpW93l^ ndQEqoX8qLwKBgGnyvQ+iZtDOdwZAZd2keRDKeqT85bC1V2vP9npjsQhUhVEfQGxU^ nvie9cAeQGm7nT1JG8fAf4smr+iQfO+Z6YF5Z65+K7cu2XezzRYQwV79xEIH21NRF^ no2+U5kNrdNyGowNLbdLsGeP7QrEUvSRwcz+3OD2CL/aAMCB4xniUPimhAoGAF8R6^ noB975uC15kf+Wqt71jqzcG01R3bbD6/oplZqBpjDxjuV3+MTReOe/FsI9uDhmODG^ nFy7+D3hUzDILDSj69ssrjgxsX99WSUWD65YeME1YHt5wWU92cZSJtjQaXUVYxOu0^ naHkfRenTTnESnocpO/mow2N4tPC7MpO3mgRNFR0CgYAbvCP/3Onj7cHO15R7O59h^ n+dM8E9P0umX45RD/w2LYkFIN/aDfq1vrKUWv+A3bc5R1Hkf7boBC+NXaVbhq9N0C^ nSdoYtj33+wDUgoQEg7UFw8XnegUm720rOpu0T75ESWzOyLGAWgbKws8myIUAvMzS^ nFZjglo7kgaDKuo3Jl5o7ug==^n-----END PRIVATE KEY-----^n | vercel env add FIREBASE_PRIVATE_KEY production
echo -----BEGIN PRIVATE KEY-----^nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCk0HfWxpT6vbkL^ nWm7UAT1VpHv+t7e9MstvoHDGLPCCvdcFt0VEaO0yRS6sAMDyj23fYwgN6WwI9de4^ nQaRhFi95NNnIzsOizzjauZ3naTK90gYEk7W4AKQBzNe4CcKHEkDk8knFI3Y6tJcn^ nWGAohJW6VEt5mJsVszwfOFKzBqwVXGP2SuGJadn1HlK7qt+MmIwdLTwPVkbAMA2S^ n9Gv6r/MQobzFhN0Laq+r4ZN3cNT3Wz/zTLc15NlrAGq1EnguZGP6Ly+mHwLv+W39^ nfLh4kqqTWy+W6PqvFLe0vh0iq2YQa/HvLP+6EUho5Lbj7X3iN5Ct0yabc7kne+e6^ nnwCK3oQhAgMBAAECggEAFdPUIzoujdyljqbd6a72WArOLyhWqbR58+EsPlrCSZZp^ nzUR95Hb+/vrhmP8KjrVHKGAdt3X0DGW+uZTb982v4N4Kf8k+aKgIEBOoIXcxtKkF^ nigKj/Of80I43/ZQxUqEsvgWGlpjBNjonkJroNUWF7OTwD/0RgPi5XCsh7LrT/IoG^ n9NeLjPoIQZZwMzwHqn07WQY3fKPeqUog+p9p6yBj45AyMlnqNavbFW/8YfGtz6OJ^ ncYRfXzhvufFwyLzMUNt0c3wk1ABWC2Eqjg6PxciqoTYtMzI76m1X52VAgV3VGik8^ nz/KlgUOvOPFiknMG/ZnVsOHCZeJVQy2B89Bj/JsF/wKBgQDUaxDvVIG3fT3wJO9R^ np7Y8bNrnv+1Ph8UdgTVWCh0qRYa/gNOba3gkDbgdEm+Dtc4T+QQQrhKewMAYQek9^ nMs1x271JOt948+u59p8SVy5ci3cQePkx9CgDctN0zHBWLNsczuOK6qxL2bVqEScq^ n1fUZhOL3T2yVPZO9qFcZJSSyrwKBgQDGoRT6QhLhZjQRbcW32Y+goTBZ3AQR5Mqc^ nZmKHpBWUGjF06Zv1la5rbiwBHFA86PflcHXH4uvn68TdbI1CqV1r/j+huKcFJgDv^ nFWN4yWkhN5M8FaaLlS2r37lQ0oMD+SVas9m/BYqT+1bHRpzP8JV8FEOLI7dpW93l^ ndQEqoX8qLwKBgGnyvQ+iZtDOdwZAZd2keRDKeqT85bC1V2vP9npjsQhUhVEfQGxU^ nvie9cAeQGm7nT1JG8fAf4smr+iQfO+Z6YF5Z65+K7cu2XezzRYQwV79xEIH21NRF^ no2+U5kNrdNyGowNLbdLsGeP7QrEUvSRwcz+3OD2CL/aAMCB4xniUPimhAoGAF8R6^ noB975uC15kf+Wqt71jqzcG01R3bbD6/oplZqBpjDxjuV3+MTReOe/FsI9uDhmODG^ nFy7+D3hUzDILDSj69ssrjgxsX99WSUWD65YeME1YHt5wWU92cZSJtjQaXUVYxOu0^ naHkfRenTTnESnocpO/mow2N4tPC7MpO3mgRNFR0CgYAbvCP/3Onj7cHO15R7O59h^ n+dM8E9P0umX45RD/w2LYkFIN/aDfq1vrKUWv+A3bc5R1Hkf7boBC+NXaVbhq9N0C^ nSdoYtj33+wDUgoQEg7UFw8XnegUm720rOpu0T75ESWzOyLGAWgbKws8myIUAvMzS^ nFZjglo7kgaDKuo3Jl5o7ug==^n-----END PRIVATE KEY-----^n | vercel env add FIREBASE_PRIVATE_KEY preview
echo -----BEGIN PRIVATE KEY-----^nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCk0HfWxpT6vbkL^ nWm7UAT1VpHv+t7e9MstvoHDGLPCCvdcFt0VEaO0yRS6sAMDyj23fYwgN6WwI9de4^ nQaRhFi95NNnIzsOizzjauZ3naTK90gYEk7W4AKQBzNe4CcKHEkDk8knFI3Y6tJcn^ nWGAohJW6VEt5mJsVszwfOFKzBqwVXGP2SuGJadn1HlK7qt+MmIwdLTwPVkbAMA2S^ n9Gv6r/MQobzFhN0Laq+r4ZN3cNT3Wz/zTLc15NlrAGq1EnguZGP6Ly+mHwLv+W39^ nfLh4kqqTWy+W6PqvFLe0vh0iq2YQa/HvLP+6EUho5Lbj7X3iN5Ct0yabc7kne+e6^ nnwCK3oQhAgMBAAECggEAFdPUIzoujdyljqbd6a72WArOLyhWqbR58+EsPlrCSZZp^ nzUR95Hb+/vrhmP8KjrVHKGAdt3X0DGW+uZTb982v4N4Kf8k+aKgIEBOoIXcxtKkF^ nigKj/Of80I43/ZQxUqEsvgWGlpjBNjonkJroNUWF7OTwD/0RgPi5XCsh7LrT/IoG^ n9NeLjPoIQZZwMzwHqn07WQY3fKPeqUog+p9p6yBj45AyMlnqNavbFW/8YfGtz6OJ^ ncYRfXzhvufFwyLzMUNt0c3wk1ABWC2Eqjg6PxciqoTYtMzI76m1X52VAgV3VGik8^ nz/KlgUOvOPFiknMG/ZnVsOHCZeJVQy2B89Bj/JsF/wKBgQDUaxDvVIG3fT3wJO9R^ np7Y8bNrnv+1Ph8UdgTVWCh0qRYa/gNOba3gkDbgdEm+Dtc4T+QQQrhKewMAYQek9^ nMs1x271JOt948+u59p8SVy5ci3cQePkx9CgDctN0zHBWLNsczuOK6qxL2bVqEScq^ n1fUZhOL3T2yVPZO9qFcZJSSyrwKBgQDGoRT6QhLhZjQRbcW32Y+goTBZ3AQR5Mqc^ nZmKHpBWUGjF06Zv1la5rbiwBHFA86PflcHXH4uvn68TdbI1CqV1r/j+huKcFJgDv^ nFWN4yWkhN5M8FaaLlS2r37lQ0oMD+SVas9m/BYqT+1bHRpzP8JV8FEOLI7dpW93l^ ndQEqoX8qLwKBgGnyvQ+iZtDOdwZAZd2keRDKeqT85bC1V2vP9npjsQhUhVEfQGxU^ nvie9cAeQGm7nT1JG8fAf4smr+iQfO+Z6YF5Z65+K7cu2XezzRYQwV79xEIH21NRF^ no2+U5kNrdNyGowNLbdLsGeP7QrEUvSRwcz+3OD2CL/aAMCB4xniUPimhAoGAF8R6^ noB975uC15kf+Wqt71jqzcG01R3bbD6/oplZqBpjDxjuV3+MTReOe/FsI9uDhmODG^ nFy7+D3hUzDILDSj69ssrjgxsX99WSUWD65YeME1YHt5wWU92cZSJtjQaXUVYxOu0^ naHkfRenTTnESnocpO/mow2N4tPC7MpO3mgRNFR0CgYAbvCP/3Onj7cHO15R7O59h^ n+dM8E9P0umX45RD/w2LYkFIN/aDfq1vrKUWv+A3bc5R1Hkf7boBC+NXaVbhq9N0C^ nSdoYtj33+wDUgoQEg7UFw8XnegUm720rOpu0T75ESWzOyLGAWgbKws8myIUAvMzS^ nFZjglo7kgaDKuo3Jl5o7ug==^n-----END PRIVATE KEY-----^n | vercel env add FIREBASE_PRIVATE_KEY development

echo.
echo ========================================
echo Setup complete! Now deploying...
echo ========================================
echo.

call vercel --prod

echo.
echo Done! Your site should be live.
pause
