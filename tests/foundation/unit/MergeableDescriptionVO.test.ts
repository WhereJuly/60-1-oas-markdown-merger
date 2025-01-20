'use strict';

import MergeableDescriptionVO from '@src/MergeableDescription.valueobject.js';
import { describe, expect, it } from 'vitest';

type TCreateArguments = [string, string[], string];

const nonMergeable = ['version', ['info', 'version'], '1.0.11'];
const mergeable = ['description', ['tags', '0', 'description'], "Everything about your Pets {% merge './valid-nonexistent.md' %}"];

describe('MergeableDescriptionVOTest', () => {

    it('+static create() #1: Should create the expected MergeableDescriptionVO object', () => {
        const actual = MergeableDescriptionVO.create(...mergeable as TCreateArguments);

        expect(actual).toBeInstanceOf(MergeableDescriptionVO);
    });

    it('+static create() #2: Should return null for non-mergeable node', () => {
        const actual = MergeableDescriptionVO.create(...nonMergeable as TCreateArguments);

        expect(actual).toEqual(null);
    });
    

});