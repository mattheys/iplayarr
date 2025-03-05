<template>
    <p class="mobileOnly" v-if="queue.length == 0 && history.length == 0">No Items in Queue</p>
    <div class='rg-container'>
        <table class='queueTable' summary='Hed'>
            <thead>
                <tr>
                    <th></th>
                    <th class=''>Filename</th>
                    <th class=''>Start</th>
                    <th class=''>Size</th>
                    <th class='progress-column'>Progress</th>
                    <th class=''>ETA</th>
                    <th class=''>Speed</th>
                    <th class='center'><font-awesome-icon :icon="['fas', 'cog']" /></th>
                </tr>
            </thead>
            <tbody>
                <QueueTableRow v-for="item in queue" :key="item.id" :item="item" :history="false"/>
                <QueueTableRow v-for="item in history" :key="item.id" :item="item" :history="true"/>
            </tbody>
        </table>
    </div>
</template>

<script setup>
    import QueueTableRow from './QueueTableRow.vue';

    import {defineProps} from 'vue';

    defineProps({
        queue : {
            type : Array,
            required : true
        },

        history : {
            type : Array,
            required : true
        }
    });
</script>

<style>
  .queueTable {
    max-width: 100%;
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    color: rgb(204, 204, 204);
  }

  .queueTable thead th {
    padding: 8px;
    border: none !important;
    text-align: left;
    font-weight: bold;
  }

  .queueTable tbody tr {
    transition: background-color 500ms;
  }

  .queueTable tbody tr:hover {
    background-color: rgba(255,255,255,0.08);
  }

  .queueTable tbody td {
    padding: 8px;
    border-top: 1px solid #858585;
    line-height: 1.52857143;
  }

  .queueTable .progress-column {
    min-width: 75px;
  }
</style>
