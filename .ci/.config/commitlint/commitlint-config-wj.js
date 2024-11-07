'use strict';

// const parserPresets = require('./parser-preset');

const configuration = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'body-max-line-length': [2, 'always', 400],
        'header-max-length': [2, 'always', 130],
        'type-enum': [2, 'always', ['Breaking!', 'Feature!', 'Fix!', 'Release', 'Implement', 'Add', 'Remove', 'Refactor', 'Update', 'Deprecate', 'Cleanup']],
        'type-case': [2, 'always', 'sentence-case'],
        'monorepo-message-format': [2, 'always', 'third-argument']

        /**
         * So far does not work.
         * Would like to parse multiple scopes within brackets, need to understand hoe parser preset
         * works in details for this.
         * @see https://regexr.com/7qpkb
         * @see ./parser-presets.js
         * @see https://commitlint.js.org/#/reference-configuration?id=parser-presets
         * @see ./node_modules/some-parser-preset there
         */
        // 'scope-enum': [2, 'always', ['icidd', '']],
    },

    // @see https://commitlint.js.org/reference/configuration.html#parser-presets
    parserPreset: './parser-preset-monorepo.js',

    /**
     * @see [commitlint-local-plugins] https://commitlint.js.org/reference/plugins.html#local-plugins
     */
    plugins: [
        {
            rules: {
                'monorepo-message-format': (args) => {
                    console.log(args);
                    return [true, 'Monorepo Message Format is OK'];
                }
            }
        }
    ]
};

console.dir(configuration);

module.exports = configuration;
