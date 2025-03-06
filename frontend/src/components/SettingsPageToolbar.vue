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
    </div>
</template>

<script setup>
    import { defineEmits, defineProps } from 'vue';

    const emit = defineEmits(['save', 'toggleAdvanced']);

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

<style lang="less">
    .SettingsPageToolbar {
        height: 60px;
        background-color: @toolbar-background-color;

        button {
            padding-top: 4px;
            min-width: 60px;
            width: min-content;
            text-align: center;
            background-color: transparent;
            border: 0px;
            height: 100%;

            &:hover {
                svg {
                    color: @brand-color;
                }
            }

            svg {
                color: @toolbar-text-color;
                height: 21px;
            }
        }

        .SettingsPageToolbar-label {
            color: @primary-text-color;
            font-size: 11px;
        }
    }
</style>