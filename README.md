# Echaly - Elegant Women's Clothing

This is the codebase for the Echaly e-commerce website, featuring elegant women's clothing.

## Local Development Setup

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Git

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_SECURE=true_or_false
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=your_from_email
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/echaly-clothing.git
cd echaly-clothing
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

### System Check

After setting up, visit [http://localhost:3000/system-check](http://localhost:3000/system-check) to verify that all components are working correctly.

## Troubleshooting

If you encounter any issues:

1. Check the system status page at `/system-check`
2. Verify your environment variables are set correctly
3. Ensure your Supabase instance is running and accessible
4. Clear your browser cache and try again

## Cross-Platform Testing

The website has been optimized for all devices, including:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome on Android)
- Tablets

## License

[Your license information here]
\`\`\`

Let's create a .env.example file:

```plaintext file=".env.example"
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_SECURE=true_or_false
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=your_from_email

# Site
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# clothingbrand
