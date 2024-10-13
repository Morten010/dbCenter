const path = require('path');

module.exports = {
    entry: './src/app.js', // Your entry point
    mode: 'production',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.node$/,
                loader: 'node-loader',
            },
            // other rules can go here
        ],
    },
};
