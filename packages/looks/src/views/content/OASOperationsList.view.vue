<template>

    <aside>
        <h3>Endpoints</h3>
        <ul>
            <li v-for="operation in vm.operations.items" v-bind:key="operation.operationID">
                <a v-bind:href="`/operations/${operation.operationID}`">
                    <dl class="looks-operations-list-link">
                        <dt v-text="operation.summary"></dt>
                        <dd v-text="operation.verb"></dd>
                    </dl>
                </a>
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