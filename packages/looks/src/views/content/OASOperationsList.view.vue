<template>

    <aside>
        <h3>OAS Operations List</h3>
        <ul>
            <li v-for="operation in vm.operations.items" v-bind:key="operation.operationID">
                <span v-text="operation.operationID"></span>
            </li>
        </ul>
    </aside>

</template>

<script lang="ts">
import OASOperationsListVM from '@src/ts/viewmodels/OASOperationsList.viewmodel';

import petstore from '@dcoupld/oas-generic-adapter/examples/oas/petstore.oas.json';
import type { OpenAPIV3_1 } from 'openapi-types';

export default {
    setup() {
        const vm = new OASOperationsListVM(petstore as unknown as OpenAPIV3_1.Document);

        return { vm };
    },
};

</script>