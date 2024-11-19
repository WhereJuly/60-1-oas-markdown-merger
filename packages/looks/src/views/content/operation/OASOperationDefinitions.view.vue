<template>

    <h2 v-text="operation.summary"></h2>

    <p v-text="operationID"></p>

    <dl class="looks-operation-specs-endpoint">
        <dt v-text="operation.verb"></dt>
        <span>http://server-selected-from-servers-key</span>
        <dd v-text="operation.route"></dd>
    </dl>

    <p v-text="operation.description"></p>

    <!-- REFACTOR: With Tags object .isEmpty getter -->
    <p v-if="hasTags(operation)">Tags: <span v-text="operation.tags.toString()"></span></p>

    <section v-if="!operation.body.isEmpty">

        <h3>Body</h3>

        <p v-if="operation.body.required"><small>Required</small></p>

        <p v-text="operation.body.description"></p>

        <OASOperationContentTypes:partial v-bind:content="operation.body.content" />

    </section>

    <section v-if="operation.responses">

        <h3>Responses</h3>

    </section>

</template>

<script lang="ts">
import { container } from 'tsyringe';

import { OASDBCException, type OASOperationVO } from '@dcoupld/oas-generic-adapter';
import { OPERATIONS_COLLECTION } from '@src/ts/adapter/AdapterBootstrap.service';
import OASOperationContentTypePartial from './content/OASOperationContentTypes.partial.vue';

export default {
    props: {
        operationID: { required: true, type: String }
    },
    components: {
        'OASOperationContentTypes:partial': OASOperationContentTypePartial
    },
    setup(props: { operationID: string; }) {

        // REFACTOR: Must be accessible from OASGenericAdapter.operations property.
        // instead of AdapterBootstrapService
        const collection = container.resolve(OPERATIONS_COLLECTION);

        const operation = collection.findByOperationID(props.operationID);

        if (!operation) {
            throw new OASDBCException(`Unexpected missing operation with ID "${props.operationID}" in the definitions provided.`);
        }

        const hasTags = (operation: OASOperationVO) => { return operation.tags && operation.tags.length > 0; };

        console.dir(operation);

        return { operationID: props.operationID, operation, hasTags };
    },
};

</script>