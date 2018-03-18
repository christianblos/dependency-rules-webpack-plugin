const path = require('path');
const CheckDependencyRulesPlugin = require('../dist/index');

module.exports = {
    context: __dirname,
    entry: './src/main.js',

    output: {
        path: path.resolve(__dirname, 'out'),
        filename: 'bundle.js'
    },

    plugins: [
        new CheckDependencyRulesPlugin({
            rules: [
                {module: 'src/domain/', deny: ['src/app/']}
            ]
        })
    ]
};