import defaultTheme from 'tailwindcss/defaultTheme';

// Brand colors, default Jelly bean
const brand = process.env.APP_BRAND || 'default';
const brandColors = require(`../colors/${brand}.json`);

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,mjs,md,mdx,vue}'],
	theme: {
		fontFamily: {
      sans: [ '"Inter var"', ...defaultTheme.fontFamily.sans ]
    },
		extend: {
			colors: {
        brand: brandColors,
        gray: {
          // gray-300
          DEFAULT: '#D1D5DB'
        }
      },
      screens: {
        xs: '475px'
      }
		},
	},
	safelist: [
    // Pagination
    'app-pager__item',
    'is_active',
    // Rich text color styles
    'text-brand',
    'text-brand-300',
    // Apos select fix caused by form reset
    'apos-input--select'
  ],
  corePlugins: {
    aspectRatio: false
  },
  // https://tailwindcss.com/docs/plugins#official-plugins
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ]
}
