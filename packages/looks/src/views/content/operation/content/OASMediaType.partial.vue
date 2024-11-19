<template>
    {{ type }}
</template>


<script lang="ts">
import { type PropType } from 'vue';

import type { OASMediaTypeVO } from '@dcoupld/oas-generic-adapter';

export default {
    props: {
        type: { required: true, type: Object as PropType<OASMediaTypeVO> }
    }
};

</script>