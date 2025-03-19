<template>
    <VueFinalModal
      class="iplayarr-modal"
      content-class="iplayarr-modal-content confirmDialog"
      overlay-transition="vfm-fade"
      content-transition="vfm-fade"
      v-slot="{close}"
    >
        <legend class="modalTitle">
            <span>{{ title }}</span>
            <font-awesome-icon class="clickable" :icon="['fas', 'xmark']" @click="close()"/>
        </legend>
        <slot/>
        <div class="button-container floor">
            <button class="clickable cancel" @click="emit('cancel')" v-if="showCancel">{{cancelLabel}}</button>
            <button class="clickable cancel" @click="close()" v-if="showClose">{{closeLabel}}</button>
            <button class="clickable" @click="emit('confirm')" v-if="showConfirm">{{confirmLabel}}</button>
        </div>
    </VueFinalModal>
</template>

<script setup>
    import { VueFinalModal } from 'vue-final-modal'
    import { defineProps, defineEmits } from 'vue';

    defineProps({
        title : String,
        showCancel : Boolean,
        cancelLabel : String,
        showClose : Boolean,
        closeLabel : String,
        showConfirm : Boolean,
        confirmLabel : String
    });

    const emit = defineEmits(['cancel', 'confirm']);
</script>

<style lang="less">
.modalTitle {
    display: flex;
    justify-content: space-between;
    width: 100%;
}
</style>