<template>

    <!-- WRITE: The selector among content types w/my @dcoupld/vue-marked -->
    <!-- WRITE: This will require the dedicated partial view -->

    <select v-model="vm.selected">
        <option v-for="type in content.types" v-bind:key="type" v-bind:value="type">
            {{ type }}
        </option>
    </select>

    <!-- NB: Force "not null" return type cast to clear TS warning -->
    <OASMediaType:partial v-bind:type="content.findType(vm.selected)!" />

</template>

<script lang="ts">
import { reactive, type PropType } from 'vue';

import type { OASContentsCollection } from '@dcoupld/oas-generic-adapter';
import OASMediaTypePartial from './OASMediaType.partial.vue';

export default {
    props: {
        content: { required: true, type: Object as PropType<OASContentsCollection> }
    },
    components: {
        'OASMediaType:partial': OASMediaTypePartial
    },
    setup(props: { content: OASContentsCollection; }) {
        const _default = props.content.types[0];
        const vm = reactive({ selected: _default });

        return { vm };
    },
};

</script>