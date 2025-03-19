<template>
    <IPlayarrModal :title="title" :show-cancel="showCancel" cancel-label="Cancel" :show-confirm="true" confirm-label="OK" @cancel="emit('cancel')" @confirm="emit('confirm', selected)">
        <p :class="[subtext ? 'hasLower' : '']">{{ text }}</p>
        <p class="sub" v-if="subtext">{{ subtext }}</p>
        <div class="alertDialogSelect">
            <SelectInput :options="computedOptions" v-if="options" v-model="selected"/>
        </div>
    </IPlayarrModal>
</template>

<script setup>
    import { defineProps, defineEmits, ref, computed } from 'vue';
    import IPlayarrModal from './IPlayarrModal.vue';
    import SelectInput from '../common/form/SelectInput.vue';

    const emit = defineEmits(['confirm', 'cancel']);

    const props = defineProps({
        title : String,
        text : String,
        subtext : String,
        showCancel : {
            type : Boolean,
            default : false
        },
        options : Array
    });

    const selected = ref(props.options ? props.options[0] : true);

    const computedOptions = computed(() => {
        return props.options ? props.options.map((v) => ({key : v, value : v})) : [];
    });
</script>

<style lang="less" scoped>
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