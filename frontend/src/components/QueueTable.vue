<template>
    <table>
        <thead>
            <tr>
                <th class="desktopOnly">ID</th>
                <th>Filename</th>
                <th class="desktopOnly">Start</th>
                <th class="desktopOnly">Size</th>
                <th>Progress</th>
                <th class="desktopOnly">ETA</th>
                <th class="desktopOnly">Speed</th>
                <th class="desktopOnly"></th>
            </tr>
        </thead>
        <tbody>
            <QueueTableRow v-for="item in queue" :key="item.id" :item="item" :history="false"/>
            <QueueTableRow v-for="item in history" :key="item.id" :item="item" :history="true"/>
        </tbody>
    </table>
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
table {
    width: 100%;
    padding: 1rem;
}

@media (min-width: 768px) {
    table {
        text-align: center;
    }
}

tr:nth-child(even) {
  background-color: rgb(42, 42, 42); /* Light gray */
}
</style>