import type {Config} from 'tailwindcss';
// import daisyui from 'daisyui';

const config: Config = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    // plugins: [require("daisyui")],
    // // @ts-expect-error: daisyui is not in the Tailwind Config type
    // daisyui: {
        // themes: ["dark"]
    // }
}

export default config;