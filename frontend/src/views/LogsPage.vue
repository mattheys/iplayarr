<template>
    <p v-if="filter.length > 0">
        Applied Filters: {{ filter.join(",")}}
    </p>
    <ul>
        <li v-for="log in filteredLogs" :key="`${log.id}_${log.timestamp}`">
            [ {{ log.id }} ] - {{ log.timestamp }} - {{ log.message }}
        </li>
    </ul>
</template>

<script setup>
import { inject, computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const logs = inject('logs');
const route = useRoute();

const filter = ref([]);

// Update filter when the route query changes
watch(() => route.query.filter, (newFilter) => {
    filter.value = newFilter ? newFilter.split(',') : [];
}, { immediate: true });

const filteredLogs = computed(() => 
    filter.value.length === 0 
        ? logs.value 
        : logs.value.filter(log => filter.value.includes(log.id))
);
</script>

<style scoped>
ul {
    list-style: none;
    font-family: monospace;
    margin-left: auto;
    margin-right: auto;
    background-color: black;
    padding: 2rem;
    line-break: loose;
    max-height: 75vh;
    overflow-y: auto;
    max-width: 80%;
}
</style>
