<template>
    <SettingsPageToolbar @save="saveConfig" @toggle-advanced="toggleAdvanced" :enabled="saveEnabled" :icons="['save', 'advanced']"/>
    <div class="inner-content">
        <legend>iPlayarr</legend>
        <SettingsTextInput name="Api Key" tooltip="API Key for access from *arr apps." v-model="config.API_KEY" :error="validationErrors.config?.API_KEY"/>
        <SettingsTextInput name="Download Directory" tooltip="Directory for in-progress Downloads." v-model="config.DOWNLOAD_DIR" :error="validationErrors.config?.DOWNLOAD_DIR"/>
        <SettingsTextInput name="Complete Directory" tooltip="Directory for completed Downloads." v-model="config.COMPLETE_DIR" :error="validationErrors.config?.COMPLETE_DIR"/>
        <SettingsTextInput name="Download Limit" tooltip="The number of simultaneous downloads." type-override="number" v-model="config.ACTIVE_LIMIT" :error="validationErrors.config?.ACTIVE_LIMIT"/>

        <template v-if="showAdvanced">
            <SettingsTextInput :advanced="true" name="Refresh Schedule" tooltip="Cron Expression for schedule refresh." v-model="config.REFRESH_SCHEDULE" :error="validationErrors.config?.REFRESH_SCHEDULE"/>
            <SettingsTextInput :advanced="true" name="TV Filename Template" tooltip="Template for TV Filenames, {title, season, episode}." v-model="config.TV_FILENAME_TEMPLATE" :error="validationErrors.config?.TV_FILENAME_TEMPLATE"/>
            <SettingsTextInput :advanced="true" name="Movie Filename Template" tooltip="Template for Movie Filenames, {title}." v-model="config.MOVIE_FILENAME_TEMPLATE" :error="validationErrors.config?.MOVIE_FILENAME_TEMPLATE"/>
        </template>

        <legend class="sub">Authentication</legend>
        <SettingsTextInput name="Username" tooltip="The Login Username." v-model="config.AUTH_USERNAME" :error="validationErrors.config?.AUTH_USERNAME"/>
        <SettingsTextInput name="Password" tooltip="The Login Password." type-override="password" v-model="config.AUTH_PASSWORD" :error="validationErrors.config?.AUTH_PASSWORD"/>

        <ArrSettings name="Sonarr" v-model="sonarrConfig"/>
        <ArrSettings name="Radarr" v-model="radarrConfig"/>
    </div>
</template>

<script setup>
    import SettingsPageToolbar from '@/components/SettingsPageToolbar.vue';
    import SettingsTextInput from '@/components/SettingsTextInput.vue';
    import ArrSettings from '@/components/ArrSettings.vue';

    import { onMounted, ref, watch, computed } from 'vue';
    import { getHost } from '@/lib/utils';

    const config = ref({});
    const configChanges = ref(false);
    const sonarrConfig = ref({
        download_client : {},
        indexer : {}
    });
    const sonarrChanges = ref(false);
    const radarrConfig = ref({
        download_client : {},
        indexer : {}
    });
    const radarrChanges = ref(false);
    const showAdvanced = ref(false);

    const validationErrors = ref({
        config : {},
        sonarr : {},
        radarr : {}
    })

    const saveEnabled = computed(() => {
        return configChanges.value || sonarrChanges.value || radarrChanges.value;
    })

    onMounted(async () => {
        const [configResponse, sonarrConfigResponse, radarrConfigResponse] = await Promise.all([
            fetch(`${getHost()}/json-api/config`, {credentials : "include"}),
            fetch(`${getHost()}/json-api/sonarr`, {credentials : "include"}),
            fetch(`${getHost()}/json-api/radarr`, {credentials : "include"})
        ]);
        
        config.value = await configResponse.json();
        sonarrConfig.value = await sonarrConfigResponse.json();
        radarrConfig.value = await radarrConfigResponse.json();

        watch(config, () => { configChanges.value = true }, { deep: true });
        watch(sonarrConfig, () => { sonarrChanges.value = true }, { deep: true });
        watch(radarrConfig, () => { radarrChanges.value = true }, { deep : true })
    });

    const saveConfig = async () => {
        if (configChanges.value || sonarrChanges.value || radarrChanges.value){
            validationErrors.value.config = {};

            const configResponse = await fetch(`${getHost()}/json-api/config`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config.value),
                credentials : "include"
            });

            if (!configResponse.ok) {
                const errorData = await configResponse.json();
                validationErrors.value.config = errorData.invalid_fields;
            } else {
                alert("Config saved OK");
            }
        }

        if (sonarrChanges.value){
            const sonarrResponse = await fetch(`${getHost()}/json-api/sonarr`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sonarrConfig.value),
                credentials : "include"
            });

            if (!sonarrResponse.ok){
                const errorData = await sonarrResponse.json();
                alert(errorData.message);
            } else {
                alert("Sonarr Config saved OK");
            }
        }

        if (radarrChanges.value){
            const radarrResponse = await fetch(`${getHost()}/json-api/radarr`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(radarrConfig.value),
                credentials : "include"
            });

            if (!radarrResponse.ok){
                const errorData = await radarrResponse.json();
                alert(errorData.message);
            } else {
                alert("Radarr Config saved OK");
            }
        }
    }

    const toggleAdvanced = () => {
        showAdvanced.value = !showAdvanced.value;
    }
</script>
