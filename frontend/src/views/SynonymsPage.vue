<template>
    <div class="inner-content">
        <legend>Synonyms</legend>
        <p>iPlayer don't save their videos in an *arr friendly way. You can use synonyms to help you bridge the gap</p>
        <SynonymsList @details="openForm" @create-synonym="openForm" @remove-synonym="removeSynonym" :synonyms="synonyms" />
        <div class="block-reset"></div>
    </div>
</template>

<script setup>
import SynonymsList from '@/components/SynonymsList.vue';
import SynonymForm from '@/components/modals/SynonymForm.vue';
import { useModal } from 'vue-final-modal'

import { ref, onMounted } from 'vue';
import { ipFetch } from '@/lib/ipFetch';

const synonyms = ref([]);

const refreshSynonyms = async () => {
    synonyms.value = (await ipFetch(`json-api/synonym`)).data;
}

onMounted(refreshSynonyms);

const openForm = (synonym) => {
    const formModal = useModal({
        component: SynonymForm,
        attrs: {
            inputObj : synonym,
            action : synonym ? 'Edit' : 'Create',
            onSave(synonym) {
                saveSynonym(synonym);
                formModal.close();
            }
        }
    });
    formModal.open();
}

const saveSynonym = async (synonym) => {
    const method = synonym.id ? 'PUT' : 'POST';
    await ipFetch('json-api/synonym', method, synonym);
    refreshSynonyms();
}

const removeSynonym = async (id) => {
    await ipFetch(`json-api/synonym`, 'DELETE', { id });
    refreshSynonyms();
}
</script>