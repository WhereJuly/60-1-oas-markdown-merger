#!/usr/bin/env node

import { Command } from 'commander';

import { colors } from '@src/cli/colors.js';
import OASMarkdownMergerFacade from '@src/OASMarkdownMerger.facade.js';

import * as pkg from '../../package.json' assert {type: 'json' };

const packageName = pkg.default.name;
const packageVersion = pkg.default.version;

const program = new Command();

program
    .name(packageName)
    .version(packageVersion)
    .description('Merges the content of markdown files mentioned with "{% merge \./docs/example.md\' %}" tags into respective OpenAPI JSON "description" fields.')
    .usage("--input <input> --output <output>")
    .requiredOption('-i, --input <input>', 'Input OAS file path. ')
    .requiredOption('-o, --output <output>', 'Output OAS file path with descriptions merged (if any).')
    .action(async (options) => {
        try {
            const facade = OASMarkdownMergerFacade.create();
            await facade.merge(options.input, options.output);

            console.log(`\n[${colors.green}INFO${colors.reset}] Successfully merged to "${options.output}" file.\n`);

        } catch (_error) {
            const error = _error as Error;

            program.error(`\n\r[${colors.red}ERROR${colors.reset}]: ${error.message}.`);
        }
    })
    .showHelpAfterError()
    .parseAsync(process.argv);
