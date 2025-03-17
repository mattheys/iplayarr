<template>
    <SettingsPageToolbar @save="saveConfig" @toggle-advanced="toggleAdvanced" :save-enabled="saveEnabled"
        :icons="['save', 'advanced']" />
    <div class="inner-content" v-if="!loading">
        <legend>iPlayarr</legend>
        <TextInput name="Api Key" tooltip="API Key for access from *arr apps." v-model="config.API_KEY"
            :error="validationErrors.config?.API_KEY" />
        <TextInput name="Download Directory" tooltip="Directory for in-progress Downloads."
            v-model="config.DOWNLOAD_DIR" :error="validationErrors.config?.DOWNLOAD_DIR" />
        <TextInput name="Complete Directory" tooltip="Directory for completed Downloads."
            v-model="config.COMPLETE_DIR" :error="validationErrors.config?.COMPLETE_DIR" />
        <TextInput name="Download Limit" tooltip="The number of simultaneous downloads." type-override="number"
            v-model="config.ACTIVE_LIMIT" :error="validationErrors.config?.ACTIVE_LIMIT" />
        <SelectInput name="Video Quality" tooltip="Maximum video quality (Where available)"
            v-model="config.VIDEO_QUALITY" :error="validationErrors.config?.ACTIVE_LIMIT" :options="qualityProfiles" />

        <template v-if="showAdvanced">
            <TextInput :advanced="true" name="Refresh Schedule" tooltip="Cron Expression for schedule refresh."
                v-model="config.REFRESH_SCHEDULE" :error="validationErrors.config?.REFRESH_SCHEDULE" />
            <TextInput :advanced="true" name="TV Filename Template"
                tooltip="Template for TV Filenames, {title, synonym, season, episode, quality}."
                v-model="config.TV_FILENAME_TEMPLATE" :error="validationErrors.config?.TV_FILENAME_TEMPLATE" />
            <TextInput :advanced="true" name="Movie Filename Template"
                tooltip="Template for Movie Filenames, {title, synonym, quality}." v-model="config.MOVIE_FILENAME_TEMPLATE"
                :error="validationErrors.config?.MOVIE_FILENAME_TEMPLATE" />
            <TextInput :advanced="true" name="Additional Download Parameters"
                tooltip="Extra parameters to pass to get_iplayer for download"
                v-model="config.ADDITIONAL_IPLAYER_DOWNLOAD_PARAMS"
                :error="validationErrors.config?.ADDITIONAL_IPLAYER_DOWNLOAD_PARAMS" />
            <p class="nzbBanner">Looking for NZB Passthrough? Check the <RouterLink to="/apps">Apps</RouterLink> section</p>
        </template>

        <legend class="sub">Authentication</legend>
        <TextInput name="Username" tooltip="The Login Username." v-model="config.AUTH_USERNAME"
            :error="validationErrors.config?.AUTH_USERNAME" />
        <TextInput name="Password" tooltip="The Login Password." type-override="password"
            v-model="config.AUTH_PASSWORD" :error="validationErrors.config?.AUTH_PASSWORD" />
    </div>
    <LoadingIndicator v-if="loading" />
</template>

<script setup>
import SettingsPageToolbar from '@/components/common/SettingsPageToolbar.vue';
import TextInput from '@/components/common/form/TextInput.vue';
import LoadingIndicator from '@/components/common/LoadingIndicator.vue';

import { onMounted, ref, watch, computed } from 'vue';
import { ipFetch } from '@/lib/ipFetch';
import SelectInput from '@/components/common/form/SelectInput.vue';
import { onBeforeRouteLeave } from 'vue-router';
import dialogService from '@/lib/dialogService';

const loading = ref(false);

const config = ref({});
const configChanges = ref(false);
const showAdvanced = ref(false);

const validationErrors = ref({
    config: {}
});

const qualityProfiles = ref([]);

const saveEnabled = computed(() => {
    return configChanges.value;
})

onMounted(async () => {
    const [configResponse, qpResponse] = await Promise.all([
        ipFetch('json-api/config'),
        ipFetch('json-api/config/qualityProfiles')
    ]);

    config.value = configResponse.data;
    qualityProfiles.value = qpResponse.data.map(({ id, name, quality }) => ({ "key": id, "value": `${name} (${quality})` }));

    watch(config, () => { configChanges.value = true }, { deep: true });
});

const saveConfig = async () => {
    loading.value = true;
    if (configChanges.value) {
        validationErrors.value.config = {};

        const configResponse = await ipFetch(`json-api/config`, 'PUT', config.value);

        if (!configResponse.ok) {
            const errorData = configResponse.data;
            validationErrors.value.config = errorData.invalid_fields;
            return;
        } else {
            dialogService.alert("Success", "Save Successful");
            configChanges.value = false;
        }
    }

    loading.value = false;
}

const toggleAdvanced = () => {
    showAdvanced.value = !showAdvanced.value;
}

onBeforeRouteLeave(async (_, __, next) => {
    if (saveEnabled.value) {
        if (await dialogService.confirm("Unsaved Changes", "You have unsaved changes. If you leave this page they will be lost.")) {
            next();
        } else {
            next(false);
        }
    }
    next();
});
</script>

<style lang="less">
.button-container {
    justify-content: flex-end;
    text-align: right;
    max-width: 650px;

    button {
        background-color: @settings-button-background-color;
        border: 1px solid @settings-button-border-color;
        padding: 6px 16px;
        font-size: 14px;
        color: @primary-text-color;
        border-radius: 4px;

        &:hover:not(:disabled) {
            border-color: @settings-button-hover-border-color;
            background-color: @settings-button-hover-background-color;
        }

        .test-success {
            color: @success-color;
        }

        .test-pending {
            animation: spin 1.25s linear infinite;
        }

        &.test-button {
            width: 115px;
        }
    }
}

.nzbBanner {
    color: @warn-color;
}
</style>
