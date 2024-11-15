<template>
    <header class="looks-container-fixed">

        <h3>header here</h3>

    </header>

    <div class="looks-content-layout looks-container-fixed">
        <OASOperationsList:view />
        <main>the context content: Contract info, an operation details, component details</main>
        <aside>code samples</aside>
    </div>

    <!-- <main>
        <router-view />
    </main> -->

    <!-- <AppOverlayContainer:view /> -->
</template>

<script lang="ts">
import OASOperationsListView from '../content/OASOperationsList.view.vue';

export default {
    components: {
        'OASOperationsList:view': OASOperationsListView
    },
    setup() {
        return {};
    },
};

</script>