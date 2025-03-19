<template>
    <IPlayarrModal :title="`${action} Cache Definition`" :show-close="true" close-label="Cancel" :show-confirm="true" confirm-label="Save" @confirm="saveCacheDefinition">
        <TextInput name="Name" tooltip="Name for the Cache Definition" v-model="form.name" placeholder="Red Dwarf"/>
        <TextInput name="URL" tooltip="iPlayer URL" v-model="form.url" placeholder="https://www.bbc.co.uk/iplayer/episodes/b008ncn6/red-dwarf"/>
    </IPlayarrModal>
</template>

<script setup>
    import TextInput from '../common/form/TextInput.vue';
    import {ref, defineEmits, onMounted, defineProps} from 'vue';
    import dialogService from '@/lib/dialogService';
import IPlayarrModal from './IPlayarrModal.vue';

    const emit = defineEmits(['save']);

    const form = ref({
        id : undefined,
        name : "",
        url : ""
    });

    const props = defineProps({
        inputObj : {
            type : Object,
            required : false,
            default : () => {}
        },

        action : {
            type : String,
            required : false,
            default : "Create"
        }
    })

    onMounted(() => {
        form.value = {
            ...form.value,
            ...props.inputObj
        }
    });

    const saveCacheDefinition = () => {
        if(form.value && form.value.name && form.value.url){
            emit('save', form.value, () => {
                form.value = {
                    id : undefined,
                    name : "",
                    url : ""
                };
            });
        } else {
            dialogService.alert('Can\'t Save', "Please complete the form");
        }
    }
</script>