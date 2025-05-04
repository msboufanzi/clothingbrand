#!/usr/bin/env node

console.log("Checking environment variables...")

const requiredVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_FROM",
  "NEXT_PUBLIC_ADMIN_EMAIL",
  "NEXT_PUBLIC_SITE_URL",
]

const missing = []

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    missing.push(varName)
  }
}

if (missing.length > 0) {
  console.error("\x1b[31m%s\x1b[0m", "Error: Missing required environment variables:")
  missing.forEach((varName) => {
    console.error(`  - ${varName}`)
  })
  console.log("\nPlease add these variables to your .env.local file.")
  process.exit(1)
} else {
  console.log("\x1b[32m%s\x1b[0m", "All required environment variables are present!")
  console.log("Your environment is correctly configured.")
  process.exit(0)
}
