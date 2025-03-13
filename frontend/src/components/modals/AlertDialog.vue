<template>
    <VueFinalModal
      class="iplayarr-modal"
      content-class="iplayarr-modal-content confirmDialog"
      overlay-transition="vfm-fade"
      content-transition="vfm-fade"
    >
        <legend>{{ title }}</legend>
        <p>{{ text }}</p>
        <div class="button-container">
            <button class="clickable" @click="emit('cancel')" v-if="showCancel">Cancel</button>
            <button class="clickable" @click="emit('confirm')">OK</button>
        </div>
    </VueFinalModal>
</template>

<script setup>
    import { VueFinalModal } from 'vue-final-modal'
    import { defineProps, defineEmits } from 'vue';

    const emit = defineEmits(['confirm', 'cancel']);

    defineProps({
        title : String,
        text : String,
        showCancel : {
            type : Boolean,
            default : false
        }
    });
</script>

<style lang="less" scoped>
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
        margin-left: 1rem;

        &:hover {
            border-color: @settings-button-hover-border-color;;
            background-color: @settings-button-hover-background-color;
        }
    }
}
</style>