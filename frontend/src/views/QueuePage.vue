<template>
    <SettingsPageToolbar :icons="['filter']" :filter-options="filterOptions" :selected-filter="filter" :filter-enabled="filter != 'All'" v-if="false"/>
    <div class="inner-content scroll-x">
        <QueueTable :queue="queue" :history="history" />
    </div>
</template>

<script setup>
    import QueueTable from '../components/queue/QueueTable.vue';
    import SettingsPageToolbar from '@/components/common/SettingsPageToolbar.vue';
import { ipFetch } from '@/lib/ipFetch';

    import {ref, inject, provide, onMounted} from 'vue';

    const filterOptions = ref([
        'ALL',
        'COMPLETE',
        'IN PROGRESS',
        'QUEUED'
    ]);
    const filter = ref('ALL');

    const queue = inject('queue');
    const history = inject('history');

    const apps = ref([]);
    provide('apps', apps);

    onMounted(async () => {
        apps.value = (await ipFetch('json-api/apps')).data;
    });
</script> 