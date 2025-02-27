<template>
    <tr class=''>
        <td class='desktopOnly' data-title='ID'>
            <RouterLink :to="{ path: '/logs', query: { filter: item.id } }">{{ item.id }}</RouterLink>
        </td>
        <td class='text' data-title='Filename'>
            <RouterLink :to="{ path: '/logs', query: { filter: item.id } }">{{ item.filename }}</RouterLink>
        </td>
        <td class='desktopOnly' data-title='Start'>{{ item.start }}</td>
        <td class='desktopOnly' data-title='Size'>{{ item.size }}</td>
        <td class='' data-title='Progress'>
            <ProgressBar :progress="item.progress" :history="history" />
        </td>
        <td class='mobileOnly mobileInline' data-title='Start'>{{ item.start }}</td>
        <td class='mobileOnly mobileInline' data-title='Size'>{{ item.size }}</td>
        <td class='mobileInline' data-title='ETA'>{{ item.eta }}</td>
        <td class='mobileInline' data-title='Speed'>{{ item.speed }}</td>
        <td class='actionCol' data-title='Action'>
            <span v-if="history">
                <font-awesome-icon class="clickable" :icon="['fas', 'trash']" @click="trash(item.id)" />
            </span>
        </td>
    </tr>
</template>

<script setup>
import ProgressBar from './ProgressBar.vue';
import { defineProps, inject } from 'vue';

const updateQueue = inject('updateQueue');

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
    await fetch(`/json-api/history?pid=${pid}`, { method: 'DELETE' });
    updateQueue();
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