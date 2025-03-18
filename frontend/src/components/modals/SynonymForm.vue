<template>
    <VueFinalModal
      class="iplayarr-modal"
      content-class="iplayarr-modal-content"
      overlay-transition="vfm-fade"
      content-transition="vfm-fade"
      v-slot="{ close }"
    >
        <legend>{{action}} Synonym</legend>
        <TextInput name="From" tooltip="Incoming term from *arr" v-model="form.from" placeholder="Apprentice UK" iconButton="history" @action="openSearchHistory"/>
        <TextInput name="To" tooltip="Outgoing search to iPlayer" v-model="form.target" placeholder="Apprentice"/>
        <TextInput name="Filename Override" tooltip="Optional Text for the filename" v-model="form.filenameOverride" placeholder="The Apprentice UK" :iconButton="searchApp.type ? 'search' : undefined" @action="openArrLookup"/>
        <TextInput name="Exemptions" tooltip="Exemptions (comma seperated)" v-model="form.exemptions" placeholder="You're Fired!"/>
        <div class="button-container floor">
            <button class="clickable cancel" @click="close()">Cancel</button>
            <button class="clickable" @click="saveSynonym">Save</button>
        </div>
    </VueFinalModal>
</template>

<script setup>
    import { VueFinalModal } from 'vue-final-modal'
    import TextInput from '../common/form/TextInput.vue';
    import {ref, defineEmits, defineProps, onMounted} from 'vue';
    import dialogService from '@/lib/dialogService';
    import { useModal } from 'vue-final-modal'
    import SearchHistoryDialog from './SearchHistoryDialog.vue';
import ArrLookupDialog from './ArrLookupDialog.vue';

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

    const searchApp = ref({});

    onMounted(() => {
        form.value = {
            ...form.value,
            ...props.inputObj
        }
    });

    const saveSynonym = () => {
        if (form.value.from && form.value.target){
            if (form.value.filenameOverride == ""){
                delete form.value.filenameOverride;
            }
            emit('save', form.value);
            form.value = {
                id: undefined,
                from : "",
                target : "",
                exemptions : "",
                filenameOverride : undefined
            };
        } else {
            dialogService.alert("Can't Save", "Please fill in a To and From");
        }
    }

    const openSearchHistory = () => {
        const formModal = useModal({
            component: SearchHistoryDialog,
            attrs : {
                onSelect : ({history, app}) => {
                    form.value.from = history.term;
                    searchApp.value = app;
                    formModal.close();
                }
            }
        });
        formModal.open();
    }

    const openArrLookup = () => {
        const formModal = useModal({
            component: ArrLookupDialog,
            attrs : {
                app : searchApp.value,
                term : form.value.from,
                onError : (err) => {
                    dialogService.alert(`Error from ${searchApp.value.name}`, `Unable to lookup ${form.value.from}`, err.message);
                },
                onSelect : (result) => {
                    form.value.filenameOverride = result;
                    formModal.close();
                }
            }
        });
        formModal.open();
    }
</script>