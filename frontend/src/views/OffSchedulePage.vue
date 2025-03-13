<template>
    <div class="inner-content">
        <legend>Off Schedule</legend>
        <p>By default, only media broadcast in the last 30 days is returned, to extend this, you need to index specific iPlayer URLs</p>
        <OffScheduleList @details="openForm" @create-cache-definition="openForm" @remove-cache-definition="remove" :cacheDefinitions="cacheDefinitions" @refresh-def="refreshCacheDefinition"/>
        <div class="block-reset"></div>
    </div>
</template>

<script setup>
    import OffScheduleForm from '@/components/OffScheduleForm.vue';
    import OffScheduleList from '@/components/OffScheduleList.vue';
    import { ipFetch } from '@/lib/ipFetch';
    import {ref, onMounted} from 'vue';
    import { useRouter } from 'vue-router';
    import { useModal } from 'vue-final-modal'

    const router = useRouter();

    const cacheDefinitions = ref([]);

    const refreshCacheDefinitions = async () => {
        cacheDefinitions.value = (await ipFetch(`json-api/offSchedule`)).data;
    }

    onMounted(refreshCacheDefinitions);

    const openForm = (cacheDef) => {
        const formModal = useModal({
            component: OffScheduleForm,
            attrs: {
                inputObj : cacheDef,
                action : cacheDef ? 'Edit' : 'Create',
                onSave : async(form, success) => {
                    const result = await saveCacheDefinition(form);
                    if (result){
                        formModal.close();
                        success();
                    }
                }
            }
        });
        formModal.open();
    }

    const remove = async (id) => {
        await ipFetch(`json-api/offSchedule`, 'DELETE', {id});
        refreshCacheDefinitions();
    }

    const saveCacheDefinition = async (form) => {
        const method = form.id ? 'PUT' : 'POST';
        const response = await ipFetch('json-api/offSchedule', method, form);
        if (response.ok){
            refreshCacheDefinitions();
            return true;
        } else {
            alert(response.data.invalid_fields?.url);
            return false;
        }
    }

    const refreshCacheDefinition = async (def) => {
        if (confirm(`Are you sure you want to refresh the cache for ${def.name}?`)) {
            await ipFetch('json-api/offSchedule/refresh', 'POST', def);
            if (confirm("Cache Refresh Started, Would you like to view the logs?")) {
                router.push("/logs");
            }
        }

}
</script>