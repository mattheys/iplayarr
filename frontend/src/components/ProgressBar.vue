<template>
    <div class="progress-bar">
        <span class="progressText">{{ progress }}%</span>
        <div class="progress" :style="{ width: progress + '%' }"></div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
    progress: {
        type: Number,
        required: true
    }
});
</script>

<style scoped>
.progress-bar {
    width: 100%;
    position: relative; /* Needed for absolute positioning of the text */
    background-color: white;
    border: 2px solid white;
    border-radius: 5px;
    overflow: hidden;
}

.progress {
    height: 20px;
    background-color: blue;
}

.progressText {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    text-align: center;
    font-weight: bold;
    color: white; /* Default color */
    z-index: 2;
    pointer-events: none;
    mix-blend-mode: difference; /* Inverts color based on background */
}

</style>
