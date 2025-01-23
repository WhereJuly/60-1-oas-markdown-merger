'use strict';

import { OpenAPIV3_1 } from 'openapi-types';

import _petstore from './petstore.oas.json' with { type: "json" };

export {
    // will add more definitions here if needed
};

export const petstore = _petstore as unknown as OpenAPIV3_1.Document;

const index = {
    petstore: petstore
};

export default index;
