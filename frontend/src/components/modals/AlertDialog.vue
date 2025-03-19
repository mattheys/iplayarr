<template>
    <IPlayarrModal :title="title" :show-cancel="showCancel" cancel-label="Cancel" :show-confirm="true" confirm-label="OK" @cancel="emit('cancel')" @confirm="emit('confirm')">
        <p :class="[subtext ? 'hasLower' : '']">{{ text }}</p>
        <p class="sub" v-if="subtext">{{ subtext }}</p>
    </IPlayarrModal>
</template>

<script setup>
    import { defineProps, defineEmits } from 'vue';
import IPlayarrModal from './IPlayarrModal.vue';

    const emit = defineEmits(['confirm', 'cancel']);

    defineProps({
        title : String,
        text : String,
        subtext : String,
        showCancel : {
            type : Boolean,
            default : false
        }
    });
</script>

<style lang="less">
    p {
        &.sub {
            font-size: 14px;
            margin-top: 0px;
        }

        &.hasLower {
            margin-bottom: 0px;
        }
    }
</style>