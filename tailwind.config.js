/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./Index.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {},
        colors: {
            'black': '#000000',
            'primary': '#252422',
            'secondary': '#312D2A',
            'tertiary': '#464241',
            'f-primary': '#DDDDDD',
            'f-secondary': '#FFFFFF',
            'f-tertiary': '#9F9E9C',
        },
    },
    plugins: [],
};
