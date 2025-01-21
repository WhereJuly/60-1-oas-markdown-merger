#!/usr/bin/env node

import { Command } from 'commander';
import type { PackageJson } from 'types-package-json';

import { colors } from '@src/cli/colors.js';
import OASMarkdownMergerFacade from '@src/core/OASMarkdownMerger.facade.js';

import { createRequire } from "module";
const pkg = createRequire(import.meta.url)("../../package.json") as PackageJson;

const program = new Command();

await program
    .name(pkg.name)
    .version(pkg.version)
    .description('Merges the content of markdown files mentioned with "{% merge \'./docs/example.md\' %}" tags into respective OpenAPI JSON "description" fields.')
    .usage("--source <file> --destination <file> [--merges-base <path>]")
    .requiredOption('-i, --source <file>', 'Source OpenAPI definitions file path.')
    .requiredOption('-o, --destination <file>', 'Destination OAS file path with descriptions merged (if any).')
    .option('-m, --merges-base <path>', 'The base path for files mentioned in the "merge" tags.')
    .action(async (options: { source: string; destination: string; mergesBase?: string; }) => {
        try {
            const facade = OASMarkdownMergerFacade.create(options.mergesBase);
            await facade.merge(options.source, options.destination);

            console.log(`\n[${colors.green}INFO${colors.reset}] Successfully merged to "${options.destination}" file.\n`);

        } catch (_error) {
            const error = _error as Error;

            program.error(`\n\r[${colors.red}ERROR${colors.reset}]: ${error.message}.`);
        }
    })
    .showHelpAfterError()
    .parseAsync(process.argv);
