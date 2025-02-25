<template>
    <QueueTable :queue="queue" :history="history" />
</template>

<script setup>
    import QueueTable from '../components/QueueTable.vue';

    import {inject} from 'vue';

    const queue = inject('queue');
    const history = inject('history');
</script>