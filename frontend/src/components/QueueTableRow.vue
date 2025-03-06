<template>
    <tr class=''>
        <td>
            <font-awesome-icon :class="[history ? 'complete' : '', item.status]" :icon="['fas', history ? 'download' : (item.status == 'Queued' ? 'cloud' : 'cloud-download')]"/>
        </td>
        <td class='text' data-title='Filename'>
            <RouterLink :to="{ path: '/logs', query: { filter: item.pid } }">{{ item.nzbName }}</RouterLink>
        </td>
        <td class='' data-title='Start'>{{ item.details.start }}</td>
        <td class='' data-title='Size'>{{ formatStorageSize(item.details.size) }}</td>
        <td class='progress-column' data-title='Progress'>
            <ProgressBar :progress="item.details.progress" :history="history" :idle="item.status == 'Queued'"/>
        </td>
        <td class='' data-title='ETA'>{{ item.details.eta }}</td>
        <td class='' data-title='Speed'>{{ item.details.speed }} {{ item.details.speed != '' ? 'MB/s' : '' }}</td>
        <td class='actionCol' data-title='Action'>
            <span v-if="history">
                <font-awesome-icon class="clickable" :icon="['fas', 'trash']" @click="trash(item.pid)" />
            </span>
            <span v-if="!history">
                <font-awesome-icon class="clickable" :icon="['fas', 'xmark']" @click="cancel(item.pid)" />
            </span>
        </td>
    </tr>
</template>

<script setup>
import { getHost } from '@/lib/utils';
import ProgressBar from './ProgressBar.vue';
import { defineProps } from 'vue';

defineProps({
    item: {
        type: Object,
        required: true
    },

    history: {
        type: Boolean,
        require: true
    }
});

const trash = async (pid) => {
    if (confirm("Are you sure you want to delete this history item?")) {
        await fetch(`${getHost()}/json-api/history?pid=${pid}`, { method: 'DELETE', credentials : "include" });
    }
}

const cancel = async (pid) => {
    if (confirm("Are you sure you want to cancel this download?")) {
        await fetch(`${getHost()}/json-api/queue?pid=${pid}`, { method: 'DELETE', credentials : "include" });
    }
}

const formatStorageSize = (mb) => {
    if (mb){
        if (mb >= 1024) {
            return (mb / 1024).toFixed(2) + " GB";
        }
        return mb.toFixed(2) + " MB";
    }
    return;
}
</script>

<style lang="less" scoped>
    .complete {
        color: @complete-color;
    }
</style>