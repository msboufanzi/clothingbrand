declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    SUPABASE_SERVICE_ROLE_KEY?: string
    SUPABASE_JWT_SECRET?: string

    // Email
    SMTP_HOST: string
    SMTP_PORT: string
    SMTP_SECURE: string
    SMTP_USER: string
    SMTP_PASSWORD: string
    SMTP_FROM: string

    // Site
    NEXT_PUBLIC_SITE_URL: string
    NEXT_PUBLIC_ADMIN_EMAIL: string

    // Vercel
    VERCEL_ENV?: string

    // Database
    POSTGRES_URL?: string
    POSTGRES_PRISMA_URL?: string
    POSTGRES_URL_NON_POOLING?: string
    POSTGRES_USER?: string
    POSTGRES_PASSWORD?: string
    POSTGRES_DATABASE?: string
    POSTGRES_HOST?: string

    // Node
    NODE_ENV: "development" | "production" | "test"
  }
}
