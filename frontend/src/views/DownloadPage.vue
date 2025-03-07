<template>
    <SettingsPageToolbar :icons="['download']" @download="download"/>
    <div class="infoBanner" :style="{'background-image' : `url(${details.thumbnail})`}">
        <div class="infoContainer">
            <h1>{{ searchResult.title }}{{ searchResult.episode ? ` - Series ${searchResult.series}, Episode ${searchResult.episode}` : '' }}</h1>
            <div class="seriesDetails" v-if="details.category">
                <span>{{ details.runtime }} Minutes</span>
                <span>{{ details.category }}</span>
                <span>{{ details.firstBroadcast }}</span>
            </div>
            <div class="seriesDetails" v-if="details.category">
                <span :class="['pill', 'grey']">
                    <font-awesome-icon :icon="['fas', searchResult.type == 'TV' ? 'tv' : 'film' ]" />
                    {{ searchResult.type }}
                </span>
                <span :class="['pill', 'grey']" v-if="details.channel">
                    <font-awesome-icon :icon="['fas', 'tower-broadcast']" />
                    {{ details.channel }}
                </span>
                <span :class="['pill', 'grey']" v-if="details.link">
                    <a :href="details.link" target="_blank">
                        <font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" />Link
                    </a>
                </span>
            </div>
            <div class="seriesDetails" v-if="details.category">
                <span>{{ details.description }}</span>
            </div>
            <LoadingIndicator v-if="!details.category"/>
        </div>
    </div>
    <div class="inner-content">
        <SettingsTextInput name="Filename" tooltip="Filename to Download as (extension will be added automatically)" v-model="searchResult.nzbName"/>
    </div>
</template>

<script setup>
import SettingsPageToolbar from '@/components/SettingsPageToolbar.vue';
import SettingsTextInput from '@/components/SettingsTextInput.vue';
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import { getHost } from '@/lib/utils';
import {watch, ref} from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const searchResult = ref({});
const details = ref({});

watch(() => route.query.json, async (newJson) => {
    searchResult.value = JSON.parse(newJson);
    const detailsResponse = await fetch(`${getHost()}/json-api/details?pid=${searchResult.value.pid}`, {credentials : "include"});
    details.value = await detailsResponse.json();
}, { immediate: true })


const download = async () => {
    const response = await fetch(`${getHost()}/json-api/download?pid=${searchResult.value.pid}&nzbName=${searchResult.value.nzbName}&type=${searchResult.value.type}`, {credentials : "include"});
    if (response.ok){
        router.push("/queue");
    }
}
</script>

<style lang="less">
    .infoBanner {
        position: relative;
        width: 100%;
        height: 325px;
        background-size: cover;
        background-position: center;

        .infoContainer {
            position: absolute;
            width: 100%;
            height: 325px;
            background-color: rgba(0,0,0,0.6);
            padding: 2rem;
            box-sizing: border-box;

            .seriesDetails {
                margin-bottom: 8px;
                font-weight: 300;
                font-size: 20px;

                span {
                    margin-right: 15px;
                }
            }
        }

        h1 {
            text-wrap: balance;
            font-weight: 300;
            font-size: 50px;
            line-height: 50px;
            margin: 0px;

            @media (max-width: @mobile-breakpoint) {
                font-size: 30px;
                line-height: 30px;
            }
        }
    }

    .pill.grey {
        padding: 3px 7px;
        font-weight: 300;
        font-size: 17px;
        background-color: @grey-pill-background-color;
        color: @primary-text-color;

        svg {
            margin-right: 3px;
        }

        margin-right: 10px !important;
    }
</style>