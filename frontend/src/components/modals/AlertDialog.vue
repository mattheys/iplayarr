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
            <button class="clickable cancel" @click="emit('cancel')" v-if="showCancel">Cancel</button>
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