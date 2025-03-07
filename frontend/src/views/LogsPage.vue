<template>
  <SettingsPageToolbar :icons="['follow', 'filter']" :follow-status="followlog" @toggle-follow="toggleFollow" :filter-enabled="filter != null" :filter-options="availableFilters" :selected-filter="selectedFilter" @select-filter="selectFilter"/>
  <div class="inner-content">
    <ul ref="logView overflow-x">
      <li v-for="log in filteredLogs" :key="`${log.id}_${log.timestamp}`">
        <pre :class="log.level">[ {{ log.id }} ] - {{ log.timestamp }} - {{ log.message.trim() }}</pre>
      </li>
    </ul>
  </div>
</template>

<script setup>
import SettingsPageToolbar from '@/components/SettingsPageToolbar.vue';
import { inject, computed, ref, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const logs = inject('logs');
const logView = ref(null);
const followlog = ref(true);

const filter = ref(null);
const defaultAvailableFilter = [
  'ALL',
  'INFO',
  'DEBUG',
  'ERROR'
];
const availableFilters = ref(defaultAvailableFilter);

watch(() => route.query.filter, (newFilter) => {
  availableFilters.value = defaultAvailableFilter;
  if (newFilter){
    availableFilters.value.push(newFilter);
    filter.value = newFilter;
  } else {
    filter.value = null;
  }
}, { immediate: true });

const selectedFilter = computed(() => {
  return filter.value == null ? 'ALL' : filter.value;
});

const filteredLogs = computed(() =>
  filter.value == null ? logs.value : logs.value.filter(log => filter.value == log.id)
);

const scrollToBottom = () => {
  nextTick(() => {
    if (logView.value) {
      logView.value.scrollTop = logView.value.scrollHeight;
    }
  });
};

watch(filteredLogs, () => {
  if (followlog.value) {
    scrollToBottom();
  }
}, { deep: true });

const toggleFollow = () => {
  followlog.value = !followlog.value
}

const selectFilter = (option) => {
  filter.value = option == 'ALL' ? null : option;
}

</script>

<style lang="less" scoped>
ul {
  list-style: none;
  font-family: monospace;
  margin-left: auto;
  margin-right: auto;
  background-color: @logs-background-color;
  padding: 2rem;
  line-break: loose;
  max-height: 75vh;
  overflow-y: auto;
  max-width: 80%;

  pre {
    margin: 0px;

    &.INFO {
      color: @success-color;
    }

    &.DEBUG {
      color: @warn-color;
    }

    &.ERROR {
      color: @error-color;
    }
  }
}
</style>
