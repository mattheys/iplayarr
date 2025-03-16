<template>
    <div class="inner-content">
        <legend>Apps</legend>
        <p>Manage your integrations with the Arr stack here</p>
        <AppsList :apps="apps" @create="openForm"/>
        <ListEditor :items="apps" @create="openForm" :actions="[['trash', deleteApp]]" v-slot="{item}">
            <div class="major">
                {{item.name}}
            </div>
            <div class="minor">
                {{ capitalize(item.type) }}
            </div>
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
    import { capitalize } from '@/lib/utils';

    const apps = ref([]);

    const refreshApps = async () => {
        apps.value = (await ipFetch("json-api/apps")).data;
    }

    onMounted(refreshApps);

    const openForm = (app) => {
        const formModal = useModal({
            component: AppForm,
            attrs : {
                action : app ? 'Edit' : 'Create',
                onSaved : async () => {
                    formModal.close();
                    await refreshApps();
                }
            }
        });
        formModal.open();
    }

    const deleteApp = async ({id, name}) => {
        if (await dialogService.confirm('Delete App', `Are you sure you want to delete ${name}`)){
            await ipFetch('json-api/apps', 'DELETE', {id});
            await refreshApps();
        }
    }
</script>