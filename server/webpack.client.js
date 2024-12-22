const path = require('path');

module.exports = {
    // Tell webpack the root file of our server application
    entry: './src/client/client.js',
    // Tell webpack where to put the output file that is generated
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
    },

    //Tell webpack to run babel on every file it runs through
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        'react',
                        'stage-0',
                        //env is a master preset and runs all transpiled rules for the last 2 versions of the browser
                        ['env',{targets:{browsers: ['last 2 versions']}}]
                    ],
                }
            }
        ]
    }
};