<template>
  <NavBar />
  <QueueTable :queue="queue" :history="history"/>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
import QueueTable from './components/QueueTable.vue';

import { io } from "socket.io-client";
import { ref, provide, onMounted } from 'vue';

const [queue, history, socket] = [ref([]), ref([]), ref(null)];

provide('queue', queue);
provide('history', history);
provide('socket', socket);

onMounted(async () => {
  const queueResponse = await fetch("/json-api/queue");
  queue.value = await queueResponse.json();
  const historyResponse = await fetch("/json-api/history");
  history.value = await historyResponse.json();
  socket.value = io();

  socket.value.on('downloads', (data) => {
    queue.value = data;
  });
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
</style>
