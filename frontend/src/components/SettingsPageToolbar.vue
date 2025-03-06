<template>
    <div class="SettingsPageToolbar">
        <button class="SettingsPageToolbar-button clickable" @click="emitEvent('save')" :disabled="!enabled" v-if="icons.some((i) => i =='save')">
            <font-awesome-icon :icon="['fas', 'floppy-disk']" />
            <div class="SettingsPageToolbar-label">
                {{enabled ? 'Save' : 'No'}} Changes
            </div>
        </button>
        <button class="SettingsPageToolbar-button clickable" @click="emitEvent('toggleAdvanced')" v-if="icons.some((i) => i =='advanced')">
            <font-awesome-icon :icon="['fas', 'cog']" />
            <div class="SettingsPageToolbar-label">
                Toggle Advanced
            </div>
        </button>
        <button class="SettingsPageToolbar-button clickable" @click="emitEvent('download')" v-if="icons.some((i) => i =='download')">
            <font-awesome-icon :icon="['fas', 'download']" />
            <div class="SettingsPageToolbar-label">
                Download
            </div>
        </button>
    </div>
</template>

<script setup>
    import { defineEmits, defineProps } from 'vue';

    const emit = defineEmits(['save', 'toggleAdvanced', 'download']);

    defineProps({
        enabled : {
            type : Boolean,
            required: true
        },
        icons : {
            type : Array,
            required: true,
            default : () => []
        }
    })

    const emitEvent = (event) => {
        emit(event);
    }
</script>

<style>
    .SettingsPageToolbar {
        height: 60px;
        background-color: rgb(38, 38, 38);
    }

    .SettingsPageToolbar-button {
        padding-top: 4px;
        min-width: 60px;
        width: min-content;
        text-align: center;
        background-color: rgba(0, 0, 0, 0);
        border: 0px;
        height: 100%;
    }

    .SettingsPageToolbar-button:hover svg {
        color: rgb(225, 31, 119);
    }

    .SettingsPageToolbar-button svg {
        color: rgb(153, 153, 153);
        height: 21px;
    }

    .SettingsPageToolbar-label {
        color: rgb(229, 229, 229);
        font-size: 11px;
    }
</style>