'use strict';

import type { OpenAPIV3_1 } from 'openapi-types';
import { reactive, type UnwrapNestedRefs } from 'vue';

import { OASOperationsCollection } from '@dcoupld/oas-generic-adapter';

export type TData = {
    operations: Readonly<OASOperationsCollection>;
};

export default class OASOperationsListVM {

    #petstore: OpenAPIV3_1.Document;

    public data: UnwrapNestedRefs<TData>;

    // Import the Generic Adapter package;
    // Provide the definitions to it;
    // Create the operations collection from definitions;
    // Expose the operations collection to the consumer (view);
    constructor(petstore: OpenAPIV3_1.Document) {
        this.#petstore = petstore;

        this.data = reactive(this._data);
    }

    public get operations(): OASOperationsCollection {
        return this.data.operations as OASOperationsCollection;
    }

    private get _data(): TData {
        return {
            operations: Object.freeze(new OASOperationsCollection(this.#petstore.paths!)),
        };
    }

}