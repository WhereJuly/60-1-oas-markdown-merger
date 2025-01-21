#!/usr/bin/env node

import { Command } from 'commander';
import type { PackageJson } from 'types-package-json';

import { colors } from '@src/cli/colors.js';
import OASMarkdownMergerFacade from '@src/core/OASMarkdownMerger.facade.js';

import { createRequire } from "module";
const pkg = createRequire(import.meta.url)("../../package.json") as PackageJson;

// console.dir(PJSON);

const program = new Command();

await program
    .name(pkg.name)
    .version(pkg.version)
    .description('Merges the content of markdown files mentioned with "{% merge ./docs/example.md\' %}" tags into respective OpenAPI JSON "description" fields.')
    .usage("--input <input> --output <output>")
    .requiredOption('-i, --input <input>', 'Input OAS file path. ')
    .requiredOption('-o, --output <output>', 'Output OAS file path with descriptions merged (if any).')
    .action(async (options: { input: string; output: string; }) => {
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
