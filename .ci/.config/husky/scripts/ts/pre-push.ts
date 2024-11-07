'use strict';

/**
 * NB: The single repo / monorepo processing could be implemented via a strategy.
 * The context (detects CLI params, the workflow configuration) calls a strategy
 * that decides whether to use the single repo or monorepo implementation.
 * 
 * WRITE: This could be implemented as a npm package with TDD. Probably later as the code here grows.
 * This could be a set of the independent objects that can be combined (maybe even extented)
 * for particular workflows as needed.
 * 
 * @see https://progressing-exclamation.atlassian.net/browse/DOMAINXPLR-98
 * 
 * [TBD] Name: composite-git-workflows
 * 
 * NB: I will see the correct paths as have to implement more functionality here.
 */

import config from '../config.json';
import { execSync } from 'child_process';

type Config = { monorepo: string[] | false; branches?: string[]; };
type Parameters = { files_await_pushing: string[], remote_with_branch: string; };

class ProcessPrePush {

    #config: Config;

    constructor() {
        const params = ProcessPrePush.prepareParameters();

        this.#config = config;

        console.log(`Processing pre-push activities before pushing to "${params.remote_with_branch}"...`);

        if (!Array.isArray(this.#config.monorepo)) {
            throw new Error('This script so far is only for monorepo holding packages.');
        }

        const packagesToProcess = this.getPackagesToProcess(params.files_await_pushing, this.#config.monorepo);

        for (let index = 0; index < packagesToProcess.length; index++) {
            const timestamp = (new Date()).toISOString().replace(/\:|\./g, '-');
            const packageName = packagesToProcess[index];

            /**
             * By default the pre-push processing is made for every branch. We can explicitly
             * define the branches to pre-push processing with `config.branches` key.
             * 
             * E.g. for `config.branches: ["master","development"]` these branches only
             * will receive pre-push processing.
             * 
             * Use Case: our pre-push processing includes tests that must finish successfully.
             * We want to push some branch as WIP that does not pass tests to a remote ,
             * skipping pre-pushing processing. Then explicitly define branches to pre-push processing
             * in the `config.branches` key.
             */
            const isBranchExcluded = config.branches.every((branchName: string) => {
                return !params.remote_with_branch.includes(branchName);
            });

            if (config.branches && isBranchExcluded) {
                console.log('Skip pre-push processing for local branch: ' + params.remote_with_branch);
                continue;
            }

            try {
                const cwd = process.cwd();
                // NB: For packages in nested folders to remove slashes
                const packageNameAsFilenamePart = packageName.replace(/[\/._]+/g, '-'); 

                console.log(`* Processing package "${packageName}" pre-push script...`);
                console.log(`See logs in './.ci/.logs/pre-push-${packageNameAsFilenamePart}-${timestamp}.log file\n---`);
                
                const output = execSync(`cd ${packageName} && npm run pre-push > ${cwd}/.ci/.logs/pre-push-${packageNameAsFilenamePart}-${timestamp}.log && cd ..`).toString();
                console.log(output);
            } catch (error) {
                console.error(`Command failed: ${error}`);
                process.exit(1);
            }

        };

    }

    /**
     * Get the CLI parameters. They are positional, both mandatory.
     * 
     * @link {Parameters}
     * 
     * First parameter should an array of filenames to push, the second one is 
     * the remote repository with branch e.g. "origin/develop".
    */
    public static prepareParameters(): Parameters {
        const args = process.argv.slice(2);

        const params = {
            files_await_pushing: args[0].split(','),
            remote_with_branch: args[1]
        };

        if (!Array.isArray(params.files_await_pushing) || params.files_await_pushing.length < 1) {
            throw new Error(`Invalid first argument "files_await_pushing". It must be non-empty array of strings.`);
        }

        if (!params.remote_with_branch) {
            throw new Error(`Invalid second argument "remote_with_branch". It must be non-empty string.`);

        }

        return params;
    };

    private getPackagesToProcess(files_await_pushing: string[], config_monorepo: string[]): string[] {
        const monorepoPackagesRegex = new RegExp(`^${config_monorepo.join('(?=\/)|^')}(?=\/)`);

        return files_await_pushing.reduce((accumulator: string[], filename: string) => {
            const packageName = filename.match(monorepoPackagesRegex);
            packageName && !accumulator.includes(packageName[0]) && accumulator.push(packageName[0]);
            return accumulator;
        }, []);
    }

}

const prePush = new ProcessPrePush();

