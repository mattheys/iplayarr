<template>
  <div
    v-if="!idle"
    :class="['progress-bar', history ? 'history' : '']"
  >
    <div
      class="progress"
      :style="{ width: progress + '%' }"
    />
  </div>

  <div
    v-if="idle"
    :class="['progress-bar', history ? 'history' : '', 'idle']"
  >
    <div
      class="progress"
      style="width: 100%"
    />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
    progress: {
        type: Number,
        required: true
    },
    history: {
        type: Boolean,
        required: false,
        default: false
    },
    idle: {
        type: Boolean,
        required: false,
        default: false
    }
});
</script>

<style lang="less" scoped>
.progress-bar {
    width: 100%;
    position: relative;
    background-color: @input-background-color;
    border-radius: 5px;
    overflow: hidden;

    .progress {
        height: 15px;
        background-color: @primary-color;
    }

    &.history {
        .progress {
            background-color: @complete-color;
        }
    }
}
</style>
