<template>
    <div class="nzb-settings">
        <legend class="sub">NZB Passthrough</legend>
        <p>If your *arr client accidentally sends a real NZB, Where should it be forwarded?</p>
        <SettingsSelectInput name="NZB Client" tooltil="Which NZB Client to use" :advanced="true" :options="client_options" v-model="nzbOptions.NZB_TYPE"/>
        <SettingsTextInput name="NZB URL" tooltip="URL For NZB passthrough"
            :advanced="true" v-model="nzbOptions.NZB_URL"/>
        <SettingsTextInput name="NZB Api Key" tooltip="API Key for NZB passthrough"
            :advanced="true" v-model="nzbOptions.NZB_API_KEY" v-if="selectedClient && selectedClient.apiKey"/>
        <SettingsTextInput name="NZB Username" tooltip="Username for NZB passthrough"
        :advanced="true" v-model="nzbOptions.NZB_USERNAME" v-if="selectedClient && selectedClient.username"/>
        <SettingsTextInput name="NZB Password" tooltip="Password for NZB passthrough"
        :advanced="true" v-model="nzbOptions.NZB_PASSWORD" type-override="password" v-if="selectedClient && selectedClient.password"/>        
            <div class="button-container" v-if="selectedClient">
                <button class="test-button" @click="testNZB">
                    <template v-if="testStatus == 'INITIAL'">
                        Test {{ selectedClient.name }}
                    </template>
                    <template v-if="testStatus == 'PENDING'">
                        <font-awesome-icon class="test-pending" :icon="['fas', 'spinner']" />
                    </template>
                    <template v-if="testStatus == 'SUCCESS'">
                        <font-awesome-icon class="test-success" :icon="['fas', 'check']" />
                    </template>
                </button>
            </div>    
    </div>
</template>

<script setup>
    import SettingsTextInput from './SettingsTextInput.vue';
    import SettingsSelectInput from './SettingsSelectInput.vue';

    import {ref, onMounted, computed, defineEmits, watch} from 'vue';
    import { ipFetch } from '@/lib/ipFetch';

    const emit = defineEmits(['updated']);

    const nzbOptions = ref({
        NZB_URL : '',
        NZB_API_KEY : '',
        NZB_TYPE : '',
        NZB_USERNAME : '',
        NZB_PASSWORD : ''
    })
    const nzbClients = ref([]);
    const testStatus = ref('INITIAL');



    const client_options = computed(() => {
        return nzbClients.value.map(({id, name}) => ({key : id, value : name}));   
    });

    const selectedClient = computed(() => {
        return nzbClients.value.find(({id}) => id == nzbOptions.value.NZB_TYPE);
    });


    onMounted(async () => {
        nzbClients.value = (await ipFetch(`json-api/nzbClients`)).data;
    });

    watch(nzbOptions, (newOptions) => emit('updated', newOptions), {immediate : true});

    const testNZB = async () => {
        testStatus.value = "PENDING";
        const {data, ok} = await ipFetch('json-api/nzb/test', 'POST', nzbOptions.value);
        if (!ok){
            alert(`Error Connecting to NZB : ${data.message}`);
            testStatus.value = "INITIAL";
        } else {
            testStatus.value = "SUCCESS";
        }
    }
</script>

<style lang="less">
.sabnzbd-settings {
    legend {
        color: @warn-color;
    }

    p {
        color: @warn-color;
    }
}
</style>