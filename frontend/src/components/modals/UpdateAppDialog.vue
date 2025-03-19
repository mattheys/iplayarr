<template>
    <VueFinalModal class="iplayarr-modal" content-class="iplayarr-modal-content" overlay-transition="vfm-fade"
        content-transition="vfm-fade" v-slot="{close}">
        <legend>Updating Apps</legend>
        <table class="resultsTable">
            <thead>
                <tr>
                    <th>App</th>
                    <th>Status</th>
                    <th>
                        <font-awesome-icon :icon="['fas', 'book-open']" />
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="app of apps" v-bind:key="app.id">
                    <td>
                        <div class="appDisplay">
                            <img class="appImg" :src="`/img/${app.type.toLowerCase()}.svg`"/>
                            <span class="appName">
                                {{app.name}}
                            </span>
                        </div>
                    </td>
                    <td v-if="appStatus[app.id]">
                        <span :class="['pill', getPillColor(appStatus[app.id].status)]">{{appStatus[app.id].status}}</span>
                    </td>
                    <td v-if="appStatus[app.id]">
                        {{appStatus[app.id].message}}
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="button-container floor">
            <button class="clickable" @click="close()">Close</button>
        </div>
    </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal'
import { ipFetch } from '@/lib/ipFetch';
import {ref, onMounted, defineEmits, inject} from 'vue';

const apps = ref([]);
const features = ref([]);
const socket = inject('socket');

const appStatus = ref({});

const emit = defineEmits(['close'])

onMounted(async () => {
    apps.value = (await ipFetch("json-api/apps")).data;
    features.value = (await ipFetch("json-api/apps/types")).data;

    apps.value = apps.value.filter(({type}) => features.value[type].includes('callback'));

    if (apps.value.length == 0){
        emit('close');
        return;
    }

    appStatus.value = apps.value.reduce((acc, {id}) => {
        acc[id] = {status : "Pending", message : ""};
        return acc;
    }, {});

    socket.value.on('app_update_status', ({id, status, message}) => {
        appStatus.value[id] = {status, message};
    });

    ipFetch("json-api/apps/updateApiKey", "POST", {});
});

const getPillColor = (status) => {
    switch (status) {
        default:
            return "grey";
        case "In Progress":
            return "error"; 
        case "Complete":
            return "success"; 
        case "Error":
            return "error";      
    }
}
</script>

<style lang="less">
.resultsTable {
    max-width: 100%;
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    color: @table-text-color;
    margin-bottom: 2rem;

    thead {
        th {
            padding: 8px;
            border-bottom: 1px solid @table-border-color;
            text-align: left;
            font-weight: bold;
        }
    }

    tbody {
        tr {
            transition: background-color 500ms;

            &:hover {
                background-color: @table-row-hover-color;
            }

            td {
                padding: 8px;
                border-top: 1px solid @table-border-color;
                line-height: 1.52857143;
                .appDisplay {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    height: 30px;

                    .appImg {
                        width: 15px;
                        filter: grayscale(100%) contrast(100%);
                    }
                }
            }
        }
    }
}
</style>