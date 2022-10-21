module.exports = {
    content: ["./src/static/**/*{.html,js}"],
    theme: {
        colors: {
            'blue': '#1fb6ff',
            'purple': '#7e5bef',
            'pink': '#ff49db',
            'orange': '#ff7849',
            'green': '#13ce66',
            'yellow': '#ffc82c',
            'gray-dark': '#273444',
            'gray': '#8492a6',
            'gray-light': '#d3dce6',
            'light-black': '#191c19',
            'white': '#FFFFFF'
        },
        fontFamily: {
            sans: ['Graphik', 'sans-serif'],
            monolisa: ['Monolisa', 'sans-serif'],
        },
        extend: {
            spacing: {
                '128': "32rem",
                '144': "136rem"
            },
            borderSpacing: {
                '4xl': '2rem'
            }
        }
    },
    plugins: [],
}