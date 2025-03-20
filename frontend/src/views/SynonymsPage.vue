<template>
    <SettingsPageToolbar :icons="['arrImport']" @arrImport="openImportWizard"/>
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
                <template v-if="item.exemptions">
                    <span :class="['pill', 'error']" v-for="exemption in item.exemptions.split(',')" v-bind:key="exemption">
                            {{exemption.trim()}}
                    </span>
                </template>
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
import SettingsPageToolbar from '@/components/common/SettingsPageToolbar.vue';
import AppSelectDialog from '@/components/modals/AppSelectDialog.vue';
import ArrLookupDialog from '@/components/modals/ArrLookupDialog.vue';

const synonyms = ref([]);

const refreshSynonyms = async () => {
    synonyms.value = (await ipFetch(`json-api/synonym`)).data;
}

onMounted(refreshSynonyms);

const openForm = (synonym, inputApp) => {
    const formModal = useModal({
        component: SynonymForm,
        attrs: {
            inputObj : deepCopy(synonym),
            inputApp,
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

const removeSynonym = async ({id}) => {
    if (await dialogService.confirm('Delete Synonym', 'Are you sure you want to delete this Synonym?')){
        await ipFetch(`json-api/synonym`, 'DELETE', { id });
        refreshSynonyms();
    }
}

const openImportWizard = async () => {
    const formModal = useModal({
        component: AppSelectDialog,
        attrs : {
            onSelectApp : (app) => {
                openArrItemList(app);
                formModal.close();
            },
            onClose : () => {
                formModal.close();
            }
        }
    });
    formModal.open();
}

const openArrItemList = async (app) => {
    const formModal = useModal({
        component: ArrLookupDialog,
        attrs : {
            app,
            showFilter : true,
            onError : (err) => {
                dialogService.alert(`Error from ${app.name}`, err.message);
            },
            onSelect : async (result) => {
                let options = [result.title];
                if (result.alternateTitles && result.alternateTitles.length > 0){
                    options = [...options, ...result.alternateTitles.map(({title}) => title)]
                }
                formModal.close();
                let from = await dialogService.select(result.title, 'Select a search Term', undefined, options);
                from = from.replaceAll(/[^a-zA-Z0-9\s.]/g, '');
                if (from !== false){
                    openForm({
                        from,
                        filenameOverride : result.title
                    }, app);
                }
            }
        }
    });
    formModal.open();
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
