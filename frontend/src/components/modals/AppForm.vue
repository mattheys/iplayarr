<template>
    <VueFinalModal
      class="iplayarr-modal"
      content-class="iplayarr-modal-content"
      overlay-transition="vfm-fade"
      content-transition="vfm-fade"
      v-slot="{ close }"
    >
    <legend>{{action}} App</legend>
    <LoadingIndicator v-if="loading"/>
    <template v-if="!loading">
            <TextInput name="Name" tooltip="App Name" v-model="form.name" :error="validationErrors?.name"/>
            <SelectInput name="Type" tooltip="App Type" v-model="form.type" :options="types"/>
            <template v-if="form.type">
                <TextInput name="URL" :tooltip="`URL for ${capitalize(form.type)}`" v-model="form.url" :error="validationErrors?.url"/>
                
                <template v-if="showForm('api_key')">
                    <TextInput name="API Key" :tooltip="`API KEY for ${capitalize(form.type)}`" v-model="form.api_key" :error="validationErrors?.api_key"/>
                    <div class="button-container">
                        <AppTestButton :app="form" ref="testButton"/>
                    </div>
                </template>

                <template v-if="showForm('username_password')">
                    <TextInput name="Username" :tooltip="`Username for ${capitalize(form.type)}`" v-model="form.username" :error="validationErrors?.username"/>
                    <TextInput name="Password" :tooltip="`Password for ${capitalize(form.type)}`" v-model="form.password" :error="validationErrors?.password"/>
                    <div class="button-container">
                        <AppTestButton :app="form" ref="testButton"/>
                    </div>
                </template>

                <template v-if="showForm('priority')">
                    <TextInput name="Priority" placeholder="25" type-override="number" :tooltip="`NZB Client Priority, (lower number is first)`" v-model="form.priority" :error="validationErrors?.priority"/>
                </template>

                <template v-if="showForm('callback')">
                    <SelectInput name="iPlayarr Protocol" :tooltip="`iPlayarr Protocol for connection from ${capitalize(form.type)}`" v-model="form.iplayarr.useSSL" :options="[{key : 'true' , value : 'https'}, {key : 'false' , value : 'http'}]"/>
                    <TextInput name="iPlayarr Host" :tooltip="`iPlayarr Host for connection from ${capitalize(form.type)}`" v-model="form.iplayarr.host"/>
                    <TextInput name="iPlayarr Port" type-override="number" :tooltip="`iPlayarr Port for connection from ${capitalize(form.type)}`" v-model="form.iplayarr.port"/>
                </template>
                
                <template v-if="showForm('download_client') || showForm('prowlarr_download_client')">
                    <legend class="sub">Download Client</legend>
                    <TextInput name="Name" placeholder="iPlayarr" :tooltip="`Name for Download Client in ${capitalize(form.type)}`" v-model="form.download_client.name" :error="validationErrors?.download_client_name"/>
                </template>

                <template v-if="showForm('indexer') || showForm('prowlarr_indexer')">
                    <legend class="sub">Indexer</legend>
                    <TextInput name="Name" placeholder="iPlayarr" :tooltip="`Name for Indexer in ${capitalize(form.type)}`" v-model="form.indexer.name" :error="validationErrors?.indexer_name"/>
                    <TextInput name="Priority" placeholder="25" type-override="number" :tooltip="`Priority in ${capitalize(form.type)}`" v-model="form.indexer.priority" :error="validationErrors?.indexer_priority"/>
                </template>
            </template>

            
            <div class="button-container">
                <button class="clickable cancel" @click="close()">Cancel</button>
                <button class="clickable" @click="saveApp">{{form.id ? 'Save' : 'Create'}}</button>
            </div>
        </template>
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
import LoadingIndicator from '../common/LoadingIndicator.vue';

    const props = defineProps({action : String, inputObj : Object});
    const emit = defineEmits(['saved']);

    const defaultForm = {
        download_client : {},
        iplayarr : {
            useSSL :  window.location.protocol == 'https:',
            host : window.location.hostname,
            port : window.location.port
        },
        indexer : {},
        priority : 5
    }

    const [features, form] = [ref({}), ref(props.inputObj || defaultForm)];
    const testButton = ref(null);
    const validationErrors = ref({});
    const loading = ref(false);

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
            name : form.value.name,
            type : form.value.type,
            ...defaultForm
        }
    }

    watch(() => form.value.type, () => {
        if (testButton.value){
            testButton.value.resetTest();
        }
        if (!form.value.id){
            resetForm();
        }
    }, {immediate : true});

    const saveApp = async () => {
        const method = form.value.id ? 'PUT' : 'POST';
        loading.value = true;
        const response = await ipFetch('json-api/apps', method, form.value);
        loading.value = false;
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