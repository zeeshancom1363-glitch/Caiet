// ============================================
// FILE: tailwind.config.js
// WHAT IT DOES: Configures Tailwind CSS with our
// custom brand colors, fonts, and design tokens.
// ============================================
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Brand primary gradient endpoints
                primary: {
                    50: '#EEF2FF',
                    100: '#E0E7FF',
                    200: '#C7D2FE',
                    300: '#A5B4FC',
                    400: '#818CF8',
                    500: '#6366F1',
                    600: '#2563EB',    // Main blue
                    700: '#1D4ED8',
                    800: '#1E40AF',
                    900: '#1E3A8A',
                },
                violet: {
                    500: '#8B5CF6',
                    600: '#7C3AED',    // Main violet
                    700: '#6D28D9',
                },
                accent: '#FACC15',   // Yellow accent for badges
                ink: '#0F172A',      // Dark text
                body: '#475569',     // Body text
                surface: '#F8FAFC',  // Background
            },
            fontFamily: {
                heading: ['"Space Grotesk"', 'sans-serif'],
                body: ['"Inter"', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-brand': 'linear-gradient(135deg, #2563EB, #7C3AED)',
                'gradient-brand-r': 'linear-gradient(135deg, #7C3AED, #2563EB)',
            },
        },
    },
    plugins: [],
};
