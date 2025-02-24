<template>
  <NavBar/>
  <div class="page">
    <SideBar />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
  import NavBar from './components/NavBar.vue'
  import SideBar from './components/SideBar.vue'
</script>

<style scoped>
.page {
  display: flex; /* Makes children sit next to each other */
}

.content {
  flex: 1; /* Allows content to take up remaining space */
  padding: 20px;
}
</style>