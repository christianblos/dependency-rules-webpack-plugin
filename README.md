# Purpose

This webpack plugin can be used to enforce layers in your application.
This is done by defining import rules like "Layer A is not allowed to access layer B".


# Installation

- With npm: `npm install --save-dev dependency-rules-webpack-plugin`
- Or with yarn: `yarn add --dev dependency-rules-webpack-plugin`

# Usage

Add Plugin to your webpack config

```js
const CheckDependencyRulesPlugin = require('dependency-rules-webpack-plugin');

module.exports = {
    //...

    plugins: [
        new CheckDependencyRulesPlugin({
            rules: [
                // files in src/domain/ may not import files from src/app/
                // and files in src/domain/ may not import from the react library
                {
                    module: '/src/domain/',
                    deny: ['/src/app/', '/node_modules/react/']
                },
                // files in src/components/ may not import files from src/app/
                {
                    module: '/src/components/',
                    deny: ['/src/app/']
                }
            ]
        })
    ],
    
    //...
};
```
