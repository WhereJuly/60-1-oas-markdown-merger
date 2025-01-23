'use strict';

import MergeableDescriptionVO from '@src/core/MergeableDescription.valueobject.js';
import { describe, expect, it } from 'vitest';

type TCreateArguments = [string, string[], string, string?];

const mergeFileBasePath = './tests/foundation/.ancillary/fixtures/markdown';
const mergeable = ['description', ['tags', '0', 'description'], "Everything about your Pets {% merge './valid-nonexistent.md' %}", mergeFileBasePath];
const nonMergeable = ['version', ['info', 'version'], '1.0.11'];

describe('MergeableDescriptionVOTest', () => {

    it('+static create() #1: Should create the expected MergeableDescriptionVO object', () => {
        const actual = MergeableDescriptionVO.create(...mergeable as TCreateArguments);

        expect(actual).toBeInstanceOf(MergeableDescriptionVO);
        expect(actual!.merged).toBeInstanceOf(Function);
    });

    it('+static create() #2: Should return null for non-mergeable node', () => {
        const actual = MergeableDescriptionVO.create(...nonMergeable as TCreateArguments);

        expect(actual).toEqual(null);
    });

    it('+merged(): Should return the "description" filed with merged md file as html', () => {
        const valid = ['description', ['tags', '0', 'description'], "Everything about your Pets {% merge './simple.md' %}", mergeFileBasePath];
        const mergeable = MergeableDescriptionVO.create(...valid as TCreateArguments);

        const actual = mergeable!.merged();

        expect(actual).toContain('Everything about your Pets <p>This is markdown file content.</p>\n');
    });

});