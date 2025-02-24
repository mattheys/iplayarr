<template>
    Missing Episodes
    <ul>
        <li v-for="episode in missing" :key="episode.id">
            {{ episode.series }} - {{ episode.season }}x{{ episode.episode }}
        </li>
    </ul>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const missing = ref([]);

onMounted(() => {
    fetch('/api?mode=missing')
        .then(response => response.json())
        .then(data => missing.value = data);
})
</script>