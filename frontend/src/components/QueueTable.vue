<template>
    <p class="mobileOnly" v-if="queue.length == 0 && history.length == 0">No Items in Queue</p>
    <div class='rg-container'>
        <table class='rg-table zebra' summary='Hed'>
            <thead>
                <tr>
                    <th class='text'>Filename</th>
                    <th class=' '>Start</th>
                    <th class='number'>Size</th>
                    <th class='progress-column'>Progress</th>
                    <th class='text'>ETA</th>
                    <th class='number'>Speed</th>
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

<style scoped>
.rg-container {
  font-size: 16px;
  line-height: 1.4;
  margin: 0;
  padding: 1em 0.5em;
}

table.rg-table {
  width: 100%;
  margin-bottom: 0.5em;
  font-size: 1em;
  border-collapse: collapse;
  border-spacing: 0;
}

table.rg-table tr {
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  text-align: left;
}

table.rg-table tr:nth-child(even) {
    background-color: rgb(42, 42, 42);
}

table.rg-table thead {
  border-bottom: 3px solid #ddd;
}

.progress-column {
    min-width: 150px;
}

th.center {
  text-align: center;
}

@media (max-width: 768px) {
  thead {
    display: none;
  }
}
</style>
