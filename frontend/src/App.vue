<template>
  <NavBar />
  <div class="main-layout">
    <LeftHandNav ref="leftHandNav"/>
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
import LeftHandNav from './components/LeftHandNav.vue';
import { RouterView } from 'vue-router';

import { io } from "socket.io-client";
import { ref, provide, onMounted } from 'vue';

const [queue, history, logs, socket] = [ref([]), ref([]), ref([]), ref(null)];

const leftHandNav = ref(null);

const updateQueue = async () => {
  const queueResponse = await fetch("/json-api/queue");
  queue.value = await queueResponse.json();
  const historyResponse = await fetch("/json-api/history");
  history.value = await historyResponse.json();
}

const toggleLeftHandNav = () => {
  leftHandNav.value.toggleLHN();
}

provide('queue', queue);
provide('history', history);
provide('socket', socket);
provide('logs', logs);
provide('updateQueue', updateQueue);
provide('toggleLeftHandNav', toggleLeftHandNav);

onMounted(async () => {
  await updateQueue();
  socket.value = io();

  socket.value.on('downloads', (data) => {
    queue.value = data;
  });

  socket.value.on('history', (data) => {
    history.value = data;
  });

  socket.value.on('log', (data) => {
    logs.value.push(data);
  })
});
</script>

<style>
body {
  padding: 0px;
  margin: 0px;
  font-family: "Roboto", "open sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  color: white;
  background-color: rgb(32, 32, 32);
  min-height: 100vh;
}
.main-layout {
  display: flex;
}
.content {
  width: 100%;
  padding: 1rem;
}
.clickable {
  cursor: pointer;
}
.pull-right {
  text-align: right;
}
@media (min-width: 768px) {
  .mobileOnly {
    display: none;
  }
}

@media (max-width: 768px) {
  .desktopOnly {
    display: none;
  }
}
</style>
