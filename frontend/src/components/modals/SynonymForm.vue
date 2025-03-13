<template>
    <VueFinalModal
      class="iplayarr-modal"
      content-class="iplayarr-modal-content"
      overlay-transition="vfm-fade"
      content-transition="vfm-fade"
      v-slot="{ close }"
    >
        <legend>{{action}} Synonym</legend>
        <SettingsTextInput name="From" tooltip="Incoming term from *arr" v-model="form.from" placeholder="Apprentice UK"/>
        <SettingsTextInput name="To" tooltip="Outgoing search to iPlayer" v-model="form.target" placeholder="Apprentice"/>
        <SettingsTextInput name="Exemptions" tooltip="Exemptions (comma seperated)" v-model="form.exemptions" placeholder="You're Fired!"/>
        <div class="button-container">
            <button class="clickable" @click="close()">Cancel</button>
            <button class="clickable" @click="saveSynonym">Save</button>
        </div>
    </VueFinalModal>
</template>

<script setup>
    import { VueFinalModal } from 'vue-final-modal'
    import SettingsTextInput from '../SettingsTextInput.vue';
    import {ref, defineEmits, defineProps, onMounted} from 'vue';
import dialogService from '@/lib/dialogService';

    const emit = defineEmits(['save']);

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

    const form = ref({
        id: undefined,
        from : "",
        target : "",
        exemptions : ""
    });

    onMounted(() => {
        form.value = {
            ...form.value,
            ...props.inputObj
        }
    });

    const saveSynonym = () => {
        if (form.value.from && form.value.target){
            emit('save', form.value);
            form.value = {
                id: undefined,
                from : "",
                target : "",
                exemptions : ""
            };
        } else {
            dialogService.alert("Can't Save", "Please fill in a To and From");
        }
    }
</script>