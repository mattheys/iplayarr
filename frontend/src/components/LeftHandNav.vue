<template>
    <div class="LeftHandNav" ref="lhn">
      <ul>
        <li class="mobileOnly pull-right">
          <font-awesome-icon :icon="['fas', 'xmark']" @click="toggleLHN"/>
        </li>
        <RouterLink to="/queue">
          <li :class="route.path === '/queue' ? 'active' : ''">
              <span @click="closeLHN">
                <font-awesome-icon :icon="['fas', 'tasks']" />
                <span class="menuText">Queue</span>
              </span>
          </li>
        </RouterLink>
        <RouterLink to="/logs">
          <li :class="route.path === '/logs' ? 'active' : ''">
              <span @click="closeLHN">
                <font-awesome-icon :icon="['fas', 'history']" />
                <span class="menuText">Logs</span>
              </span>
          </li>
        </RouterLink>
        <RouterLink to="/about">
          <li :class="[route.path === '/about' ? 'active' : '', 'clickable']">
              <span @click="closeLHN">
                <font-awesome-icon :icon="['fas', 'circle-info']" />
                <span class="menuText">About</span>
              </span>
          </li>
      </RouterLink>
      </ul>
    </div>
  </template>

  <script setup>
    import {ref, defineExpose} from 'vue';
    import { useRoute } from 'vue-router';

    const route = useRoute();

    const lhn = ref(null);

    const toggleLHN = () => {
      lhn.value.classList.toggle('show');
    }

    const closeLHN = () => {
      lhn.value.classList.remove('show');
    }

    defineExpose({ toggleLHN });
  </script>
  
  <style scoped>
  .LeftHandNav {
    width: 210px;
    background-color: rgb(42, 42, 42);
    color: rgb(225, 226, 227);
    height: 100vh;
    z-index: 3;
    font-size: 14px;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .LeftHandNav {
      display: none;
    }

    .LeftHandNav.show {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
    }

    .LeftHandNav li {
      border-bottom: 1px solid white;
      padding-bottom: 1rem;
    }
  }
  
  .LeftHandNav ul {
    list-style: none;
    padding: 0;
  }
  
  .LeftHandNav li {
    padding: 1rem;
    padding-left: 1.5rem;
  }
  
  .LeftHandNav a {
    color: rgb(225, 226, 227);
    text-decoration: none;
  }

  .active {
    background-color: rgb(51, 51, 51);
    color: rgb(225, 31, 119);
  }
  
  .LeftHandNav a:hover {
    color: rgb(225, 31, 119);
  }

  .menuText {
    margin-left: 1rem;
  }
  </style>