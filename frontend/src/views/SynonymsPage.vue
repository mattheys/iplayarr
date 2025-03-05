<template>
    <div class="synonym-container">
        <legend>Synonyms</legend>
        <p>BBC don't save their videos in an *arr friendly way. You can use synonyms to help you bridge the gap</p>
        <SynonymsList @create-synonym="openForm" @remove-synonym="removeSynonym" :synonyms="synonyms"/>
        <div class="block-reset"></div>
        <SynonymForm v-if="create" @save="newSynonym"/>
    </div>
</template>

<script setup>
    import SynonymsList from '@/components/SynonymsList.vue';
    import SynonymForm from '@/components/SynonymForm.vue';

    import {ref, onMounted} from 'vue';
import { getHost } from '@/lib/utils';

    const create = ref(false);
    const synonyms = ref([]);

    const refreshSynonyms = async () => {
        const synonymResponse = await fetch(`${getHost()}/json-api/synonym`, {credentials : "include"});
        synonyms.value = await synonymResponse.json();
    }

    onMounted(refreshSynonyms);

    const openForm = () => {
        create.value = true;
    }

    const newSynonym = async (synonym) => {
        create.value = false;
        await fetch(`${getHost()}/json-api/synonym`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(synonym),
            credentials : "include"
        });
        refreshSynonyms();
    }

    const removeSynonym = async (id) => {
        await fetch(`${getHost()}/json-api/synonym`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id}),
            credentials : "include"
        });
        refreshSynonyms();
    }
</script>

<style>
    .synonym-container {
        padding: 1rem;
    }
</style>