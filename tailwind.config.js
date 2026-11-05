/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // "Clean & bright" palette. The logo navy (#12436b) and sky blue
        // (#66b5e0) carry the identity on white and cool light-grey grounds;
        // green (#0b7a53, 5.3:1 with white text) is reserved for primary
        // actions and anything verified. Legacy token names are kept so
        // long-tail pages inherit the look without a class-by-class rewrite.
        chalk: {
          DEFAULT: '#ffffff',
          50: '#ffffff',
          100: '#f8fafc',
          200: '#f1f5f9',
          300: '#e2e8f0',
          400: '#cbd5e1',
        },
        ink: {
          DEFAULT: '#14212e',
          soft: '#475569',
          mute: '#64748b',
        },
        petrol: {
          900: '#071c2e',
          800: '#0b2b45',
          700: '#0f3a5c',
          600: '#12436b',
          500: '#175180',
          400: '#2c6a97',
          300: '#4a8ab5',
        },
        mint: {
          300: '#a9d6ee',
          200: '#cfe7f5',
          100: '#e3f0f9',
        },
        marigold: {
          DEFAULT: '#66b5e0',
          600: '#4a9cc8',
          500: '#66b5e0',
          400: '#8cc6e6',
          100: '#e3f0f9',
        },
        sky: {
          700: '#2f7fb0',
          600: '#4a9cc8',
          500: '#66b5e0',
          400: '#8cc6e6',
          200: '#cfe7f5',
          100: '#e3f0f9',
        },
        // Default Tailwind blues/greens are overridden so any long-tail utility
        // still lands on the brand navy and the verification green.
        blue: {
          50: '#eef5fb',
          100: '#e3f0f9',
          200: '#cfe7f5',
          300: '#a9d6ee',
          400: '#66b5e0',
          500: '#2f7fb0',
          600: '#175180',
          700: '#12436b',
          800: '#0f3a5c',
          900: '#0b2b45',
          950: '#071c2e',
        },
        green: {
          50: '#ecf8f2',
          100: '#d4efe2',
          200: '#a9dec5',
          300: '#6fc39e',
          400: '#2f9f72',
          500: '#0b7a53',
          600: '#096845',
          700: '#08573a',
          800: '#064530',
          900: '#053626',
        },
        terra: {
          DEFAULT: '#2f7fb0',
          600: '#256994',
          500: '#2f7fb0',
          400: '#5aa3c9',
          100: '#e8f1f8',
        },
        blush: '#f1f5f9',
        sand: '#f1f5f9',
        sage: '#a9d6ee',
        jade: '#0b7a53',
        clay: '#a8452c',
        rule: '#e2e8f0',
        'rule-strong': '#cbd5e1',

        // Wise-style system (awesome-design-md/wise.md) mapped onto the
        // EduExpress brand: lime is the single CTA accent (navy text, 9.9:1),
        // the sage canvas carries page bands, white cards sit on it, and the
        // logo navy replaces Wise's near-black ink. Never set lime as text on
        // white (1.5:1) — only on navy, or as a fill under navy text.
        lime: {
          DEFAULT: '#9fe870',
          hover: '#b8f28f',
          pale: '#e2f6d5',
          deep: '#054d28',
        },
        canvas: {
          DEFAULT: '#ffffff',
          soft: '#e8ebe6',
        },
        peach: '#ffc091',

        // `ed-*` utilities (bg-ed-navy, text-ed-mist, ...) are used by ~270
        // classes across About, Contact, Partnership and other pages but were
        // never defined, so those elements rendered with no colour at all
        // (white text on white). Mapped onto the brand palette here.
        ed: {
          navy: '#12436b',
          ink: '#14212e',
          mist: '#a9d6ee',
          paper: '#f8fafc',
          sky: '#66b5e0',
          teal: '#2f7fb0',
          sand: '#f1f5f9',
        },

        // Legacy aliases: still referenced by long-tail screens and admin.
        'primary-blue': '#12436b',
        'primary-blue-dark': '#0b2b45',
        'primary-blue-light': '#a9d6ee',
        'secondary-orange': '#66b5e0',
        'secondary-orange-light': '#8cc6e6',
        'accent-green': '#0b7a53',
        'accent-purple': '#175180',
        'text-dark': '#14212e',
        'text-medium': '#475569',
        'text-light': '#64748b',
        'bg-white': '#ffffff',
        'bg-gray-50': '#f8fafc',
        'bg-gray-100': '#f1f5f9',
        'border-light': '#e2e8f0',

        // Neutrals are Tailwind's cool slate so untouched utilities stay clean.
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        emerald: {
          50: '#e3f0f9',
          100: '#cfe7f5',
          200: '#a9d6ee',
          300: '#7fc1e4',
          400: '#4a8ab5',
          500: '#2d7a5f',
          600: '#256b52',
          700: '#12436b',
          800: '#0f3a5c',
          900: '#0b2b45',
        },
        amber: {
          50: '#e3f0f9',
          100: '#cfe7f5',
          200: '#a9d6ee',
          300: '#8cc6e6',
          400: '#66b5e0',
          500: '#4a9cc8',
          600: '#2f7fb0',
          700: '#256994',
          800: '#1b5075',
          900: '#12436b',
        },
      },
      fontFamily: {
        sans: ['var(--font-text)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-text)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-display)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-text)', 'system-ui', 'sans-serif'],
        primary: ['var(--font-text)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-display)', 'system-ui', 'sans-serif'],
        bengali: ['var(--font-bengali)', 'var(--font-text)', 'sans-serif'],
        'bengali-display': ['var(--font-bengali-display)', 'var(--font-bengali)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '10px',
        sm: '8px',
        md: '12px',
        lg: '18px',
        xl: '24px',
        '2xl': '30px',
        '3xl': '38px',
        '4xl': '48px',
        pill: '999px',
      },
      boxShadow: {
        plate: '0 1px 2px rgba(66, 45, 24, 0.05)',
        lift: '0 22px 48px -26px rgba(69, 48, 26, 0.32)',
        deep: '0 34px 80px -34px rgba(69, 48, 26, 0.4)',
        inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      },
      maxWidth: {
        shell: '1320px',
        prose: '68ch',
      },
      spacing: {
        gutter: 'clamp(1.25rem, 4vw, 4rem)',
        section: 'clamp(4rem, 9vw, 8rem)',
      },
      transitionTimingFunction: {
        ledger: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        float: 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(18px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.72' },
        },
      },
    },
  },
  plugins: [],
};
