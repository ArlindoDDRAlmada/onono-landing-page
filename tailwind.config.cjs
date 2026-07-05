/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#00d4ff',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: '#0ea5e9',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				accent: {
					DEFAULT: '#8b5cf6',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				// Onono Brand Colors - Futuristic Dark Theme
				onono: {
					// Deep midnight blue backgrounds
					midnight: {
						50: '#e6f1ff',
						100: '#cce3ff',
						200: '#99c7ff',
						300: '#66abff',
						400: '#338fff',
						500: '#0073ff',
						600: '#005ccc',
						700: '#004599',
						800: '#0a1628',
						900: '#050d1a',
						950: '#020810',
					},
					// Glowing cyan accent
					cyan: {
						50: '#ecfeff',
						100: '#cffafe',
						200: '#a5f3fc',
						300: '#67e8f9',
						400: '#22d3ee',
						500: '#00d4ff',
						600: '#0891b2',
						700: '#0e7490',
						800: '#155e75',
						900: '#164e63',
					},
					// Electric blue
					electric: {
						50: '#eff6ff',
						100: '#dbeafe',
						200: '#bfdbfe',
						300: '#93c5fd',
						400: '#60a5fa',
						500: '#3b82f6',
						600: '#2563eb',
						700: '#1d4ed8',
						800: '#1e40af',
						900: '#1e3a8a',
					},
					// Logo green (leaf/bird mark)
					green: {
						50: '#effef2',
						100: '#d9fbe0',
						200: '#b5f5c4',
						300: '#7deb97',
						400: '#4cdd68',
						500: '#2ecc40',
						600: '#1fa932',
						700: '#1c852b',
						800: '#1b6827',
						900: '#175622',
					},
					// Purple accent for variety
					purple: {
						50: '#faf5ff',
						100: '#f3e8ff',
						200: '#e9d5ff',
						300: '#d8b4fe',
						400: '#c084fc',
						500: '#a855f7',
						600: '#9333ea',
						700: '#7c3aed',
						800: '#6b21a8',
						900: '#581c87',
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			fontFamily: {
				sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
				display: ['var(--font-display)', 'Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
				serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' },
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.5)' },
					'50%': { boxShadow: '0 0 30px rgba(0, 212, 255, 0.8), 0 0 60px rgba(0, 212, 255, 0.4)' },
				},
				'glow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' },
				},
				'particle-float': {
					'0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
					'10%': { opacity: '1' },
					'90%': { opacity: '1' },
					'100%': { transform: 'translateY(-100vh) translateX(20px)', opacity: '0' },
				},
				'slide-in-left': {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
				'gradient-shift': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite',
				'particle-float': 'particle-float 15s linear infinite',
				'slide-in-left': 'slide-in-left 0.6s ease-out',
				'slide-in-right': 'slide-in-right 0.6s ease-out',
				'gradient-shift': 'gradient-shift 8s ease infinite',
				'shimmer': 'shimmer 2s linear infinite',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-onono': 'linear-gradient(135deg, #00d4ff 0%, #0891b2 50%, #3b82f6 100%)',
				'gradient-dark': 'linear-gradient(180deg, #0a1628 0%, #050d1a 100%)',
				'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
				'gradient-glow': 'radial-gradient(ellipse at center, rgba(0,212,255,0.15) 0%, transparent 70%)',
			},
			backdropBlur: {
				xs: '2px',
			},
			boxShadow: {
				'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(0, 212, 255, 0.1)',
				'glow-cyan-lg': '0 0 30px rgba(0, 212, 255, 0.4), 0 0 60px rgba(0, 212, 255, 0.2)',
				'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)',
				'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
				'glass-lg': '0 25px 50px rgba(0, 0, 0, 0.4)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}