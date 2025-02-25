<template>
    <tr :class="[history ? 'history' : '']">
        <td>{{ item.id }}</td>
        <td>{{ item.filename }}</td>
        <td>{{ item.start }}</td>
        <td>{{ item.size }}</td>
        <td>
            <ProgressBar :progress="item.progress" v-if="!history"/>
            <span v-else>COMPLETE</span>
        </td>
        <td>{{ item.eta }}</td>
        <td>{{ item.speed }}</td>
    </tr>
</template>

<script setup>
import ProgressBar from './ProgressBar.vue';
import { defineProps } from 'vue';

defineProps({
    item: {
        type: Object,
        required: true
    },

    history: {
        type: Boolean,
        require: true
    }
});
</script>