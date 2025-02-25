<template>
    <tr :class="[history ? 'history' : '']">
        <td><RouterLink :to="{ path: '/logs', query: { filter: item.id } }">{{ item.id }}</RouterLink></td>
        <td>{{ item.filename }}</td>
        <td>{{ item.start }}</td>
        <td>{{ item.size }}</td>
        <td>
            <ProgressBar :progress="item.progress" v-if="!history"/>
            <span v-else>COMPLETE</span>
        </td>
        <td>{{ item.eta }}</td>
        <td>{{ item.speed }}</td>
        <td>
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