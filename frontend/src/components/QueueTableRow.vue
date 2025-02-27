<template>
    <tr class=''>
        <td class='text' data-title='Filename'>
            <RouterLink :to="{ path: '/logs', query: { filter: renderItem.id } }">{{ renderItem.filename }}</RouterLink>
        </td>
        <td class='desktopOnly' data-title='Start'>{{ renderItem.start }}</td>
        <td class='desktopOnly' data-title='Size'>{{ formatStorageSize(renderItem.size) }}</td>
        <td class='' data-title='Progress'>
            <ProgressBar :progress="renderItem.progress" :history="history" :idle="renderItem.status == 'Idle'"/>
        </td>
        <td class='mobileOnly mobileInline' data-title='Start'>{{ renderItem.start }}</td>
        <td class='mobileOnly mobileInline' data-title='Size'>{{ formatStorageSize(renderItem.size) }}</td>
        <td class='mobileInline' data-title='ETA'>{{ renderItem.eta }}</td>
        <td class='mobileInline' data-title='Speed'>{{ renderItem.speed }} {{ renderItem.speed != '' ? 'MB/s' : '' }}</td>
        <td class='actionCol' data-title='Action'>
            <span v-if="history">
                <font-awesome-icon class="clickable" :icon="['fas', 'trash']" @click="trash(renderItem.id)" />
            </span>
            <span v-if="!history">
                <font-awesome-icon class="clickable" :icon="['fas', 'xmark']" @click="cancel(renderItem.id)" />
            </span>
        </td>
    </tr>
</template>

<script setup>
import ProgressBar from './ProgressBar.vue';
import { defineProps, computed } from 'vue';

const props = defineProps({
    item: {
        type: Object,
        required: true
    },

    history: {
        type: Boolean,
        require: true
    }
});

const renderItem = computed(() => {
    if (props.history) {
        return props.item;
    } else {
        let queueItem = {
            ...props.item.details,
            filename: props.item.nzbName,
            status : props.item.status,
            id: props.item.pid,            
        };

        if (!props.item.details?.start || queueItem.status == 'Idle'){
            queueItem = {
                ...queueItem,
                start: queueItem.status == 'Idle' ? 'Queued' : 'Pending',
                size: '?',
                eta: '??:??:??',
                speed: '0',
                progress: '0'
            }
        }
        return queueItem;
    }
});



const trash = async (pid) => {
    if (confirm("Are you sure you want to delete this history item?")) {
        await fetch(`/json-api/history?pid=${pid}`, { method: 'DELETE' });
    }
}

const cancel = async (pid) => {
    if (confirm("Are you sure you want to cancel this download?")) {
        await fetch(`/json-api/queue?pid=${pid}`, { method: 'DELETE' });
    }
}

const formatStorageSize = (mb) => {
    if (mb >= 1024) {
        return (mb / 1024).toFixed(2) + " GB";
    }
    return mb.toFixed(2) + " MB";
}
</script>

<style scoped>
a {
    color: white;
    text-decoration: none;
}

a:hover {
    font-weight: bold;
}

td {
    padding: 0.8rem 0.5rem;
}

@media (min-width: 768px) {
    .actionCol {
        text-align: center;
    }
}

@media (max-width: 768px) {
  td:not(.desktopOnly) {
    display: block;
    padding: 0.5em;
  }

  td.mobileInline {
    display: inline-block;
    padding: 0.5em;
  }

  td.text {
    word-break: break-word; /* For modern browsers */
    overflow-wrap: anywhere; /* Ensures long words wrap */
  }

  .actionCol span {
    position: relative;
    left: calc(100% - 16px);
  }
}
</style>