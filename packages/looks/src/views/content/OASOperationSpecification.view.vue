<template>

    <h2 v-text="operation.summary"></h2>

    <p v-text="operationID"></p>

    <dl class="looks-operation-specs-endpoint">
        <dt v-text="operation.verb"></dt>
        <span>http://server-selected-from-servers-key</span>
        <dd v-text="operation.route"></dd>
    </dl>

    <p v-text="operation.description"></p>
    <p v-if="hasTags(operation)">Tags: <span v-text="operation.tags.toString()"></span></p>

    <section v-if="operation.body">
    
        <h3>Body</h3>
        
        <p v-text="(operation.body as OpenAPIV3_1.RequestBodyObject).description"></p>
        <p v-if="(operation.body as OpenAPIV3_1.RequestBodyObject).required"><b>Required</b></p>

        <ul>
            <!-- WRITE: The selector among content types w/my @dcoupld/vue-marked -->
            <li v-for="[type, definitions] in requestContent(operation)">
                <b v-text="type"></b>
                <p v-text="definitions"></p>
                <hr>
            </li>
        </ul>

    </section>

    <section v-if="operation.responses">

        <h3>Responses</h3>



    </section>

</template>

<script lang="ts">
import { OASDBCException, type OASOperationVO } from '@dcoupld/oas-generic-adapter';
import { OPERATIONS_COLLECTION } from '@src/ts/adapter/AdapterBootstrap.service';
import type { OpenAPIV3_1 } from 'openapi-types';
import { container } from 'tsyringe';


export default {
    props: {
        operationID: { required: true, type: String }
    },
    components: {
    },
    setup(props: { operationID: string; }) {
        // console.log(props.operationID);

        const collection = container.resolve(OPERATIONS_COLLECTION);

        // REFACTOR: Implement findByOperationID on OASOperationsCollection.
        const operation = collection.items.find((operation: OASOperationVO) => {
            return operation.operationID === props.operationID;
        });

        if (!operation) {
            throw new OASDBCException(`Unexpected missing operation with ID "${props.operationID}" in the definitions provided.`);
        }

        const hasTags = (operation: OASOperationVO) => { return operation.tags && operation.tags.length > 0; };

        // WRITE: get operation.body.contentItems(): get the key: value pairs of the content items. 
        const requestContent = (operation: OASOperationVO): [string | null, unknown][] => {
            // REFACTOR: In actual implementation to avoid redundant type casts.
            return operation.body && (operation.body as OpenAPIV3_1.RequestBodyObject).content ?
                Object.entries(((operation.body as OpenAPIV3_1.RequestBodyObject)).content) : [[null, null]];
        };

        const responseContent = (operation: OASOperationVO): [string | null, unknown][] => {
            // REFACTOR: In actual implementation to avoid redundant type casts.
            return operation.body && (operation.body as OpenAPIV3_1.RequestBodyObject).content ?
                Object.entries(((operation.body as OpenAPIV3_1.RequestBodyObject)).content) : [[null, null]];
        };

        console.dir(operation);

        return { operationID: props.operationID, operation, hasTags, requestContent };
    },
};

</script>