<template>
    <VueFinalModal
      class="iplayarr-modal"
      content-class="iplayarr-modal-content"
      overlay-transition="vfm-fade"
      content-transition="vfm-fade"
      v-slot="{ close }"
    >
    <legend>{{action}} App</legend>
        <TextInput name="Name" tooltip="App Name" v-model="form.name"/>
        <SelectInput name="Type" tooltip="App Type" v-model="form.type" :options="types"/>
        <template v-if="form.type">
            <TextInput name="URL" :tooltip="`URL for ${capitalize(form.type)}`" v-model="form.url" :error="validationErrors?.url"/>
            <TextInput name="API Key" :tooltip="`API KEY for ${capitalize(form.type)}`" v-model="form.api_key" :error="validationErrors?.api_key"/>
            <div class="button-container">
                <AppTestButton :app="form" ref="testButton"/>
            </div>
            <TextInput name="iPlayarr Host" :tooltip="`iPlayarr Host for connection from ${capitalize(form.type)}`" v-model="form.iplayarr.host"/>
            <TextInput name="iPlayarr Port" type-override="number" :tooltip="`iPlayarr Port for connection from ${capitalize(form.type)}`" v-model="form.iplayarr.port"/>
            <template v-if="showForm('download_client')">
                <legend class="sub">Download Client</legend>
                <TextInput name="Name" :tooltip="`Name for Download Client in ${capitalize(form.type)}`" v-model="form.download_client.name"/>
            </template>

            <template v-if="showForm('indexer')">
                <legend class="sub">Indexer</legend>
                <TextInput name="Name" :tooltip="`Name for Indexer in ${capitalize(form.type)}`" v-model="form.indexer.name"/>
                <TextInput name="Priority" type-override="number" :tooltip="`Priority in ${capitalize(form.type)}`" v-model="form.indexer.priority"/>
            </template>
        </template>

        
        <div class="button-container">
            <button class="clickable cancel" @click="close()">Cancel</button>
            <button class="clickable" @click="saveApp">{{form.id ? 'Save' : 'Create'}}</button>
        </div>
    </VueFinalModal>
</template>

<script setup>
    import { VueFinalModal } from 'vue-final-modal'
    import TextInput from '../common/form/TextInput.vue';
    import SelectInput from '../common/form/SelectInput.vue';
    import AppTestButton from '../apps/AppTestButton.vue';

    import { ref, defineEmits, defineProps, onMounted, computed, watch } from 'vue';
    import { capitalize } from '@/lib/utils';
    import { ipFetch } from '@/lib/ipFetch';

    defineProps({action : String});
    const emit = defineEmits(['saved']);

    const [features, form] = [ref({}), ref({
        download_client : {},
        iplayarr : {},
        indexer : {}
    })];
    const testButton = ref(null);
    const validationErrors = ref({});

    const types = computed(() => { return Object.keys(features.value).map((k) => ({key : k, value : capitalize(k)}));});

    onMounted(async () => {
        features.value = (await ipFetch('json-api/apps/types')).data;
    });

    const showForm = (type) => {
        if (form.value.type){
            return features.value[form.value.type]?.includes(type);
        } else {
            return false;
        }
    }

    const resetForm = () => {
        form.value = {
            type : form.value.type,
            download_client : {},
            iplayarr : {},
            indexer : {}
        }
    }

    watch(() => form.value.type, () => {
        if (testButton.value){
            testButton.value.resetTest();
            resetForm();
        }
    }, {immediate : true});

    const saveApp = async () => {
        const method = form.id ? 'PUT' : 'POST';
        const response = await ipFetch('json-api/apps', method, form.value);
        if (response.ok){
            emit('saved');
        } else {
            validationErrors.value = response.data.invalid_fields;
        }
    }

</script>

<style lang="less">
    .button-container {
        justify-content: flex-end;
        text-align: right;
        max-width: 650px;
        margin-bottom: 1rem;
    }
</style>