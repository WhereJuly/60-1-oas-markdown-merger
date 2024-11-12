'use strict';

import { OpenAPIV3_1 } from 'openapi-types';

import valid_json from './valid.json';
import smallest_oas from './smallest.oas.json';
import _petstore from './petstore.oas.json';
import operations from './operations.json';

export {
    valid_json,
    smallest_oas,
    operations
};

export const petstore = _petstore as unknown as OpenAPIV3_1.Document;

const index = {
    valid_json,
    smallest_oas,
    petstore: petstore as OpenAPIV3_1.Document,
    operations
};

export default index;
