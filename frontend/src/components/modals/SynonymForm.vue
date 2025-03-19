<template>
    <IPlayarrModal :title="`${action} Synonym`" :show-close="true" close-label="Cancel" :show-confirm="true" confirm-label="Save" @confirm="saveSynonym">
        <TextInput name="From" tooltip="Incoming term from *arr" v-model="form.from" placeholder="Apprentice UK" iconButton="history" @action="openSearchHistory" button-tooltip="Look at Search History"/>
        <TextInput name="To" tooltip="Outgoing search to iPlayer" v-model="form.target" placeholder="Apprentice"/>
        <TextInput name="Filename Override" tooltip="Optional Text for the filename" v-model="form.filenameOverride" placeholder="The Apprentice UK" :brandButton="searchApp.type ? searchApp.type : undefined" @action="openArrLookup" :button-tooltip="searchApp.type ? `Lookup on ${searchApp.name}` : ''"/>
        <TextInput name="Exemptions" tooltip="Exemptions (comma seperated)" v-model="form.exemptions" placeholder="You're Fired!"/>
    </IPlayarrModal>
</template>

<script setup>
    import TextInput from '../common/form/TextInput.vue';
    import {ref, defineEmits, defineProps, onMounted} from 'vue';
    import dialogService from '@/lib/dialogService';
    import { useModal } from 'vue-final-modal'
    import SearchHistoryDialog from './SearchHistoryDialog.vue';
    import ArrLookupDialog from './ArrLookupDialog.vue';
    import IPlayarrModal from './IPlayarrModal.vue';

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
        },

        inputApp : Object
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

        if (props.inputApp){
            searchApp.value = props.inputApp;
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
                    searchApp.value = app || {};
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
                    form.value.filenameOverride = result.title;
                    formModal.close();
                }
            }
        });
        formModal.open();
    }
</script>