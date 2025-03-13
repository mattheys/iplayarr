<template>
    <SettingsPageToolbar :icons="['filter']" :filter-options="filterOptions" :selected-filter="filter" :filter-enabled="filter != 'All'" v-if="false"/>
    <div class="inner-content scroll-x">
        <QueueTable :queue="queue" :history="history" />
    </div>
</template>

<script setup>
    import QueueTable from '../components/QueueTable.vue';
    import SettingsPageToolbar from '@/components/SettingsPageToolbar.vue';

    import {ref, inject} from 'vue';

    const filterOptions = ref([
        'ALL',
        'COMPLETE',
        'IN PROGRESS',
        'QUEUED'
    ]);
    const filter = ref('ALL');

    const queue = inject('queue');
    const history = inject('history');
</script>