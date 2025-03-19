<template>
    <IPlayarrModal :show-close="true" close-label="Cancel" title="Lookup">
        <LoadingIndicator v-if="loading"/>
        <template v-if="!loading">
            <table class="resultsTable">
                <thead>
                    <tr>
                        <th>Result</th>
                        <th>
                            <font-awesome-icon :icon="['fas', 'gears']" />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="result of results" v-bind:key="result">
                        <td>{{ result }}</td>
                        <td>
                            <a class="clickable" @click="emit('select', result)">
                                Select
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <template v-if="results.length == 0">
                <p>No Results Found</p>
            </template>
        </template>
    </IPlayarrModal>
</template>

<script setup>
    import { ipFetch } from '@/lib/ipFetch';
    import {ref, onMounted, defineEmits, defineProps} from 'vue';
    import LoadingIndicator from '../common/LoadingIndicator.vue';
    import IPlayarrModal from './IPlayarrModal.vue';

    const results = ref([]);
    const emit = defineEmits(['select', 'error'])
    const props = defineProps({app : Object, term : String});
    const loading = ref(true);

    onMounted(async () => {
        const response = await ipFetch(`json-api/synonym/lookup/${props.app.id}?term=${props.term}`);
        if (response.ok){
            results.value = response.data;
            loading.value = false;
        } else {
            emit('error', response.data);
        }
    });
</script>

<style lang="less" scoped>
.resultsTable {
    max-width: 100%;
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    color: @table-text-color;

    thead {
        th {
            padding: 8px;
            border-bottom: 1px solid @table-border-color;
            text-align: left;
            font-weight: bold;
        }
    }

    tbody {
        tr {
            transition: background-color 500ms;

            &:hover {
                background-color: @table-row-hover-color;
            }

            td {
                padding: 8px;
                border-top: 1px solid @table-border-color;
                line-height: 1.52857143;
                .appDisplay {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    height: 30px;

                    .appImg {
                        width: 15px;
                        filter: grayscale(100%) contrast(100%);
                    }
                }
            }
        }
    }
}

.floor {
    margin-top: 1rem;
}

</style>