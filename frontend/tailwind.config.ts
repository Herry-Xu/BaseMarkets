import type { Config } from 'tailwindcss';
import { withAccountKitUi, createColorSet } from "@account-kit/react/tailwind";

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@account-kit/react/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(0, 122, 255)',      // Bright Blue
        secondary: 'rgb(255, 255, 255)',   // Pure White
        accent: 'rgb(0, 184, 196)',       // Turquoise
        success: 'rgb(21, 190, 119)',     // Green
        warning: 'rgb(255, 69, 58)',      // Red
        background: 'rgb(247, 250, 252)', // Light Gray
        card: 'rgb(255, 255, 255)',       // Pure White
        'text-primary': 'rgb(15, 23, 42)', // Almost Black
        'text-secondary': 'rgb(51, 65, 85)', // Dark Gray
        'text-muted': 'rgb(100, 116, 139)', // Medium Gray
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default withAccountKitUi(config, {
  colors: {
    // Button colors
    'btn-primary': createColorSet('rgb(0, 122, 255)', 'rgb(0, 122, 255)'),
    'btn-secondary': createColorSet('rgb(0, 122, 255)', 'rgb(0, 122, 255)'),
    'btn-auth': createColorSet('rgb(0, 184, 196)', 'rgb(0, 184, 196)'),

    // Foreground colors
    'fg-primary': createColorSet('rgb(15, 23, 42)', 'rgb(15, 23, 42)'),
    'fg-secondary': createColorSet('rgb(51, 65, 85)', 'rgb(51, 65, 85)'),
    'fg-tertiary': createColorSet('rgb(100, 116, 139)', 'rgb(100, 116, 139)'),
    'fg-invert': createColorSet('rgb(255, 255, 255)', 'rgb(255, 255, 255)'),
    'fg-disabled': createColorSet('rgb(148, 163, 184)', 'rgb(148, 163, 184)'),
    'fg-accent-brand': createColorSet('rgb(0, 122, 255)', 'rgb(0, 122, 255)'),
    'fg-critical': createColorSet('rgb(255, 69, 58)', 'rgb(255, 69, 58)'),

    // Surface colors
    'bg-surface-default': createColorSet('rgb(255, 255, 255)', 'rgb(255, 255, 255)'),
    'bg-surface-subtle': createColorSet('rgb(247, 250, 252)', 'rgb(247, 250, 252)'),
    'bg-surface-inset': createColorSet('rgba(15, 23, 42, 0.6)', 'rgba(15, 23, 42, 0.6)'),
    'bg-surface-critical': createColorSet('rgb(254, 242, 242)', 'rgb(254, 242, 242)'),
    'bg-surface-error': createColorSet('rgb(254, 242, 242)', 'rgb(254, 242, 242)'),
    'bg-surface-success': createColorSet('rgb(236, 253, 245)', 'rgb(236, 253, 245)'),
    'bg-surface-warning': createColorSet('rgb(255, 247, 237)', 'rgb(255, 247, 237)'),

    // Border colors
    'active': createColorSet('rgb(0, 122, 255)', 'rgb(0, 122, 255)'),
    'static': createColorSet('rgb(226, 232, 240)', 'rgb(226, 232, 240)'),
    'critical': createColorSet('rgb(255, 69, 58)', 'rgb(255, 69, 58)'),
  },
  borderRadius: 'lg',
});
