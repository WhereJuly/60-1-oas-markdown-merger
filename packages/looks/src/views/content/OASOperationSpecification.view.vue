<template>
    <p>OASOperationSpecification.view.vue</p>
    <p v-text="operationID"></p>
</template>

<script lang="ts">

export default {
    props: {
        operationID: { required: true, type: String }
    },
    components: {
    },
    setup(props: { operationID: string; }) {
        console.log(props.operationID);

        return { operationID: props.operationID };
    },
};

</script>