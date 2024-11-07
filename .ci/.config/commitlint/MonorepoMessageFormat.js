'use strict';

const config = require('../ci.config.json');

const NAME = 'monorepo-message-format';

class MonorepoMessageFormat {
    constructor() {
        this.config = config;
        this.name = NAME;
        this.requiredPackages = [...this.config.monorepo, 'monorepo'];

        this.process = this.process.bind(this);
    }

    /**
     * Parameters include the tokens names defined in `parserPreset` commitlint configuration
     * `parserOpts.headerCorrespondence` field. E.g. for monorepo message format the are
     * `['packages', 'type', 'scope', 'ticket', 'subject']`.
     *
     * @params example follows
     *
     * ```javascript
     * packages: 'monorepo',
     * type: 'Update',
     * scope: 'icicdd',
     * ticket: null,
     * subject: 'experiment with custom plugin #4',
     * merge: null,
     * header: '[monorepo] Update (icicdd): experiment with custom plugin #4',
     * body: null,
     * footer: null,
     * notes: [],
     * // There are more parameters. Maybe document those some time.
     * ```
     */
    process({ packages }) {
        console.log(packages);
        const isValid = this.includesRequiredPackages(packages);
        const message = isValid ? '' : `Only the required packages "${config.monorepo}" from ci.config.json[monorepo] or just 'monorepo' must be presented. "${packages} given"`;
        return [isValid, message];
    }

    /**
     * Check if the `packages` token value includes the allowed packages.
     * The default element - `monorepo` - can be omitted from the config.
     * 
     * @params {String | null} packagesTokenValue Equals `null` if the parser did not find the token value.
     * @example `[monorepo, adapters/generic]`
     */
    includesRequiredPackages(packagesTokenValue) {
        if (!packagesTokenValue) {
            return false;
        }

        const packages = packagesTokenValue.replace(/[ \t]+/g, '').split(',');
        // NB: `package` is a reserved word.
        return packages.every((_package) => this.requiredPackages.includes(_package));
    }
}

module.exports = MonorepoMessageFormat;
