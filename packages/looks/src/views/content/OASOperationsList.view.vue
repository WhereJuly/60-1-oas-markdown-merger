<template>

    <aside>
        <h3>Endpoints</h3>
        <ul>
            <li v-for="operation in operations.items" v-bind:key="operation.operationID">
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
import { container } from 'tsyringe';

import { OPERATIONS_COLLECTION } from '@src/ts/adapter/AdapterBootstrap.service';

export default {
    setup() {
        const operations = container.resolve(OPERATIONS_COLLECTION);

        return { operations };
    },
};

</script>