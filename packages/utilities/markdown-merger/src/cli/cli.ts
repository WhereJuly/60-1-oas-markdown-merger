#!/usr/bin/env node

import { Command } from 'commander';
import type { PackageJson } from 'types-package-json';

import { colors } from '@src/cli/colors.js';
import OASMarkdownMergerFacade from '@src/core/OASMarkdownMerger.facade.js';

import { createRequire } from "module";
const pkg = createRequire(import.meta.url)("../../package.json") as PackageJson;

const program = new Command();

program
    .name(pkg.name)
    .version(pkg.version)
    .description('Merges the content of markdown files (translated to HTML, sanitized) mentioned inside OpenAPI JSON source file "description" fields\' merge tags (namely e.g. "{% merge \'./docs/example.md\' %}") into the destination\'s respective "description" fields.')
    .usage("--source <file> --destination <file> [--merges-base <path>]")
    .option('-s, --source <file>', 'Source OpenAPI definitions file.')
    .option('-d, --destination <file>', 'Destination OpenAPI definitions file with descriptions merged (if any).')
    .option('-m, --merges-base <path>', 'The base path for files mentioned in the "merge" tags. Defaults to the project root ("process.cwd()").')
    .hook('preAction', (thisCommand, _actionCommand) => {
        const args = thisCommand.opts();

        if (!args.source || !args.destination) {
            console.log(`\n[${colors.yellow}WARNING${colors.reset}] Provide the required "--source" and "--destination" arguments.\n`);

            program.help();
        }

    })
    .action(async (options: { source: string; destination: string; mergesBase?: string; }) => {

        console.log(`\n[${colors.yellow}WARNING${colors.reset}] Provide the required "--source" and "--destination" arguments.\n`);

        try {
            const facade = OASMarkdownMergerFacade.create(options.mergesBase);
            await facade.merge(options.source, options.destination);

            console.log(`\n[${colors.green}INFO${colors.reset}] Successfully merged to "${options.destination}" file.\n`);

        } catch (_error) {
            const error = _error as Error;

            program.error(`\n\r[${colors.red}ERROR${colors.reset}]: ${error.message}.`);
        }
    })
    .showHelpAfterError();

async function main() {
    await program.parseAsync(process.argv);
}

await main();