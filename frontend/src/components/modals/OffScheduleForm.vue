<template>
    <VueFinalModal
      class="iplayarr-modal"
      content-class="iplayarr-modal-content"
      overlay-transition="vfm-fade"
      content-transition="vfm-fade"
      v-slot="{ close }"
    >
        <legend>{{action}} Cache Definition</legend>
        <TextInput name="Name" tooltip="Name for the Cache Definition" v-model="form.name" placeholder="Red Dwarf"/>
        <TextInput name="URL" tooltip="iPlayer URL" v-model="form.url" placeholder="https://www.bbc.co.uk/iplayer/episodes/b008ncn6/red-dwarf"/>
        <div class="button-container floor">
            <button class="clickable cancel" @click="close()">Cancel</button>
            <button @click="saveCacheDefinition">Save</button>
        </div>
    </VueFinalModal>
</template>

<script setup>
    import { VueFinalModal } from 'vue-final-modal'
    import TextInput from '../common/form/TextInput.vue';
    import {ref, defineEmits, onMounted, defineProps} from 'vue';
    import dialogService from '@/lib/dialogService';

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