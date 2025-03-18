<template>
    <div class="inner-content">
        <legend>Apps</legend>
        <p class="mb-0">Manage your integrations with Apps (including Arr and NZB Clients) here</p>
        <sub>In order for NZB Forwarding to work successfully, your NZB Client needs the category "iplayer"</sub>
        <div class="block-reset"></div>
        <AppsList :apps="apps" @create="openForm"/>
        <ListEditor :items="apps" @create="openForm" :actions="[['trash', deleteApp]]" v-slot="{item}">
            <a @click="openForm(item)">
                <div class="major">
                    <img class="appImg" :src="`/img/${item.type.toLowerCase()}.svg`"/>
                    <span class="appName">
                        {{item.name}}
                    </span>
                </div>
                <div class="sub">
                    {{ item.url }}
                </div>
                <div class="featureList">
                    <span :class="['pill', item.download_client?.id ? 'success' : 'error']" v-if="hasFeature(item.type, 'download_client') || hasFeature(item.type, 'prowlarr_download_client')">
                            Download Client
                    </span>
                    <span :class="['pill', item.indexer?.id ? 'success' : 'error']" v-if="hasFeature(item.type, 'indexer') || hasFeature(item.type, 'prowlarr_indexer')">
                            Indexer
                    </span>
                    <span :class="['pill', 'grey']" v-if="hasFeature(item.type, 'priority')">
                            Priority: {{ item.priority }}
                    </span>
                </div>
            </a>
        </ListEditor>
        <div class="block-reset"></div>
    </div>
</template>

<script setup>
    import ListEditor from '@/components/common/ListEditor.vue';
    import { ipFetch } from '@/lib/ipFetch';
    import {ref, onMounted} from 'vue';
    import { useModal } from 'vue-final-modal'
    import AppForm from '@/components/modals/AppForm.vue';
    import dialogService from '@/lib/dialogService';
    import { deepCopy } from '@/lib/utils';

    const apps = ref([]);
    const features = ref([]);

    const refreshApps = async () => {
        apps.value = (await ipFetch("json-api/apps")).data;
        features.value = (await ipFetch("json-api/apps/types")).data;
        console.log(features.value);
    }

    onMounted(refreshApps);

    const openForm = (app) => {
        const formModal = useModal({
            component: AppForm,
            attrs : {
                action : app ? 'Edit' : 'Create',
                inputObj : deepCopy(app),
                onSaved : async () => {
                    formModal.close();
                    await refreshApps();
                }
            }
        });
        formModal.open();
    }

    const deleteApp = async ({id, name}) => {
        if (await dialogService.confirm('Delete App', `Are you sure you want to delete ${name}`, 'Indexers and Download Clients in the target Arr, will NOT be deleted')){
            await ipFetch('json-api/apps', 'DELETE', {id});
            await refreshApps();
        }
    }

    const hasFeature = (itemType, type) => {
        return features.value[itemType] && features.value[itemType].includes(type);
    }
</script>

<style lang="less" scoped>
    .major {
        display: flex;
        align-items: center;
        gap: 6px;
        height: 30px;

        .appImg {
            width: 25px;
            filter: grayscale(100%) contrast(100%);
        }
    }

    .featureList {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-top: 6px;
    }
</style>