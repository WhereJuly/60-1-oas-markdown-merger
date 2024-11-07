'use strict';

const Configuration = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'body-max-line-length': [2, 'always', 400],
        'header-max-length': [2, 'always', 130],
        'type-enum': [2, 'always', ['Breaking!', 'Feature!', 'Fix!', 'Release', 'Implement', 'Add', 'Remove', 'Refactor', 'Update', 'Deprecate', 'Cleanup']],
        'type-case': [2, 'always', 'sentence-case'],

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
    parserPreset: './parser-preset.js',
};

module.exports = Configuration;
