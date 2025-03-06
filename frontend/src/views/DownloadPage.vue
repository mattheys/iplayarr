<template>
    <SettingsPageToolbar :icons="['download']" @download="download"/>
    <div class="inner-content">
        <legend>{{ searchResult.title }}</legend>
        <SettingsTextInput name="Filename" tooltip="Filename to Download as" v-model="searchResult.nzbName"/>
    </div>
</template>

<script setup>
import SettingsPageToolbar from '@/components/SettingsPageToolbar.vue';
import SettingsTextInput from '@/components/SettingsTextInput.vue';
import { getHost } from '@/lib/utils';
import {watch, ref} from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const searchResult = ref({});

watch(() => route.query.json, (newJson) => {
    searchResult.value = JSON.parse(newJson);
}, { immediate: true })


const download = async () => {
    const response = await fetch(`${getHost()}/json-api/download?pid=${searchResult.value.pid}&nzbName=${searchResult.value.nzbName}`, {credentials : "include"});
    if (response.ok){
        router.push("/queue");
    }
}
</script>