import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors: Professional, trustworthy, precise
        brand: {
          primary: '#0F172A',    // Slate 900 - Authority
          secondary: '#1E40AF',  // Blue 700 - Trust
          accent: '#F59E0B',     // Amber 500 - Attention/Warning
          success: '#10B981',    // Emerald 500 - Verification
          danger: '#EF4444',     // Red 500 - Critical
          muted: '#64748B',      // Slate 500 - Secondary text
        },
        forensic: {
          evidence: '#3B82F6',   // Blue for evidence markers
          verified: '#10B981',   // Green for verified items
          flagged: '#F59E0B',    // Amber for flagged issues
          critical: '#EF4444',   // Red for critical findings
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'forensic': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'atos': '0 0 20px rgba(59, 130, 246, 0.3)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config
