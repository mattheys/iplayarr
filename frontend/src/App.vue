<template>
  <NavBar />
  <div class="main-layout">
    <LeftHandNav ref="leftHandNav" v-if="authState.user" />
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
import { ref, provide, watch, inject } from 'vue';
import { getHost } from './lib/utils';

const authState = inject("authState");
const [queue, history, logs, socket, hiddenSettings] = [ref([]), ref([]), ref([]), ref(null), ref({})];

const leftHandNav = ref(null);

const updateQueue = async () => {
  const queueResponse = await fetch(`${getHost()}/json-api/queue`, { credentials: "include" });
  queue.value = await queueResponse.json();
  const historyResponse = await fetch(`${getHost()}/json-api/history`, { credentials: "include" });
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
provide('hiddenSettings', hiddenSettings);

const pageSetup = async () => {
  if (socket.value == null){
    await updateQueue();
    if (process.env.NODE_ENV == 'production') {
      socket.value = io();
    } else {
      const socketUrl = `http://${window.location.hostname}:4404`
      socket.value = io(socketUrl);
    }

    socket.value.on('queue', (data) => {
      queue.value = data;
    });

    socket.value.on('history', (data) => {
      history.value = data;
    });

    socket.value.on('log', (data) => {
      logs.value.push(data);
    })

    const hsResponse = await fetch(`${getHost()}/json-api/hiddenSettings`, { credentials: "include" });
    hiddenSettings.value = await hsResponse.json();
  }
}

watch(authState, async (newAuthState) => {
  if (newAuthState.user){
    pageSetup();
  }
}, {immediate : true});

// onMounted(async () => {
//   alert("on mounted");
// });
</script>

<style>
body {
  padding: 0px;
  margin: 0px;
  font-family: "Roboto", "open sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  color: rgb(229, 229, 229);
  background-color: rgb(32, 32, 32);
  min-height: 100vh;
}

.main-layout {
  display: flex;
}

.content {
  width: 100%;
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

legend {
  font-size: 21px;
  border-bottom: 1px solid rgb(229, 229, 229);
  line-height: 32.1px;
  margin-bottom: 21px;
}

legend.sub {
  font-size: 16px;
}

.block-reset {
  display: block;
  clear: both;
}
</style>
