<template>
    <tr :class="[history ? 'history' : '']">
        <td class="desktopOnly"><RouterLink :to="{ path: '/logs', query: { filter: item.id } }">{{ item.id }}</RouterLink></td>
        <td><RouterLink :to="{ path: '/logs', query: { filter: item.id } }">{{ item.filename }}</RouterLink></td>
        <td class="desktopOnly">{{ item.start }}</td>
        <td class="desktopOnly">{{ item.size }}</td>
        <td>
            <ProgressBar :progress="item.progress" v-if="!history"/>
            <span v-else>COMPLETE</span>
        </td>
        <td class="desktopOnly">{{ item.eta }}</td>
        <td class="desktopOnly">{{ item.speed }}</td>
        <td class="desktopOnly">
            <font-awesome-icon class="clickable" :icon="['fas', 'trash']" v-if="history" @click="trash(item.id)" />
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
    await fetch(`/json-api/history?pid=${pid}`, {method : 'DELETE'});
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
</style>