const path = require('path');
const CheckDependencyRulesPlugin = require('../dist/index');

module.exports = {
    entry: path.resolve(__dirname, 'src/main.js'),

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },

    plugins: [
        new CheckDependencyRulesPlugin({
            rules: [
                {module: /src\/domain\//, deny: [/src\/app\//]}
            ]
        })
    ]
};