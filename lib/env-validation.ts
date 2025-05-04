/**
 * Validates required environment variables
 * @returns An object with validation results
 */
export function validateEnv() {
  const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

  const emailEnvVars = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM"]

  const siteEnvVars = ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_ADMIN_EMAIL"]

  const missingRequired = requiredEnvVars.filter((env) => !process.env[env])
  const missingEmail = emailEnvVars.filter((env) => !process.env[env])
  const missingSite = siteEnvVars.filter((env) => !process.env[env])

  return {
    isValid: missingRequired.length === 0,
    missingRequired,
    missingEmail,
    missingSite,
    hasEmailConfig: missingEmail.length === 0,
    hasSiteConfig: missingSite.length === 0,
  }
}

/**
 * Gets a safe environment variable value
 * @param key The environment variable key
 * @param defaultValue Optional default value if the environment variable is not set
 * @returns The environment variable value or the default value
 */
export function getEnv(key: keyof NodeJS.ProcessEnv, defaultValue = ""): string {
  return process.env[key] || defaultValue
}
