<template>
    <SettingsPageToolbar />
    <div class="search-content" v-if="!loading">
        <table class="resultsTable">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Filename</th>
                    <th>Channel</th>
                    <th>PID</th>
                    <th>
                        <font-awesome-icon :icon="['fas', 'gears']" />
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="result of searchResults" v-bind:key="result.pid">
                    <td>{{ result.number }}</td>
                    <td>{{ result.title }}</td>
                    <td>{{ result.nzbName }}</td>
                    <td>
                        <span :class="['channelLabel', result.channel.replaceAll(' ', '')]">
                            {{ result.channel }}
                        </span>
                    </td>
                    <td>{{ result.pid }}</td>
                    <td>
                        <font-awesome-icon :class="['clickable', result.downloading ? 'downloading' : '']" :icon="['fas', 'cloud-download']" @click="download(result)"/>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <LoadingIndicator v-if="loading"/>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import { getHost } from '@/lib/utils';
import SettingsPageToolbar from '@/components/SettingsPageToolbar.vue';
import LoadingIndicator from '@/components/LoadingIndicator.vue';

const route = useRoute();
const router = useRouter();

const searchResults = ref([]);
const searchTerm = ref("");
const loading = ref(true);

watch(() => route.query.searchTerm, async (newSearchTerm) => {
    if (newSearchTerm) {
        loading.value = true;
        searchResults.value = [];
        searchTerm.value = newSearchTerm;
        const response = await fetch(`${getHost()}/json-api/search?q=${searchTerm.value}`, { credentials: "include" });
        searchResults.value = await response.json();
        loading.value = false;
    }
}, { immediate: true });

const download = async(searchResult) => {
    router.push({ name : 'download', query : {json : JSON.stringify(searchResult)}});
}
</script>

<style scoped>
.search-content {
    padding: 1rem;
}

.resultsTable {
    max-width: 100%;
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    color: rgb(204, 204, 204);
}

.resultsTable thead th {
    padding: 8px;
    border: none !important;
    text-align: left;
    font-weight: bold;
}

.resultsTable tbody tr {
    transition: background-color 500ms;
}

.resultsTable tbody tr:hover {
    background-color: rgba(255, 255, 255, 0.08);
}

.resultsTable tbody td {
    padding: 8px;
    border-top: 1px solid #858585;
    line-height: 1.52857143;
}

.resultsTable .progress-column {
    min-width: 75px;
}

.channelLabel {
    padding: 1px 3px;
    font-size: 11px;
    border-radius: 2px;

    background-color: #ffa500;
    border-color: #ffa500;
    color: white;
}

.channelLabel.BBCOne {
    background-color: #f05050;
    border-color: #f05050;
    color: white;
}

.channelLabel.BBCTwo {
    background-color: #5d9cec;
    border-color: #5d9cec;
    color: white;
}
</style>