<template>
    <div class="inner-content">
        <legend>Synonyms</legend>
        <p>iPlayer don't save their videos in an *arr friendly way. You can use synonyms to help you bridge the gap</p>
        <ListEditor :items="synonyms" @create="openForm" :actions="[['trash', removeSynonym]]" v-slot="{item}">
            <div class="major" @click="openForm(item)">
                {{item.from}}
            </div>
            <div class="minor" @click="openForm(item)">
                {{item.target}}
            </div>
            <div class="featureList">
                <span :class="['pill', 'success']" v-if="item.filenameOverride">
                        {{item.filenameOverride}}
                </span>
                <span :class="['pill', 'error']" v-for="exemption in item.exemptions.split(',')" v-bind:key="exemption">
                        {{exemption.trim()}}
                </span>
            </div>
        </ListEditor>
        <div class="block-reset"></div>
    </div>
</template>

<script setup>
import ListEditor from '@/components/common/ListEditor.vue';
import SynonymForm from '@/components/modals/SynonymForm.vue';
import { useModal } from 'vue-final-modal'

import { ref, onMounted } from 'vue';
import { ipFetch } from '@/lib/ipFetch';
import dialogService from '@/lib/dialogService';

import { deepCopy } from '@/lib/utils';

const synonyms = ref([]);

const refreshSynonyms = async () => {
    synonyms.value = (await ipFetch(`json-api/synonym`)).data;
}

onMounted(refreshSynonyms);

const openForm = (synonym) => {
    const formModal = useModal({
        component: SynonymForm,
        attrs: {
            inputObj : deepCopy(synonym),
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
    if (await dialogService.confirm('Delete Synonym', 'Are you sure you want to delete this Synonym?')){
        await ipFetch(`json-api/synonym`, 'DELETE', { id });
        refreshSynonyms();
    }
}
</script>

<style lang="less" scoped>
    .featureList {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-top: 6px;
    }
</style>