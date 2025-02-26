<template>
    <div class="LeftHandNav" ref="lhn">
      <ul>
        <li class="mobileOnly pull-right">
          <font-awesome-icon :icon="['fas', 'xmark']" @click="toggleLHN"/>
        </li>
        <li>
          <RouterLink to="/queue">
            <span @click="closeLHN">
              <font-awesome-icon :icon="['fas', 'tasks']" />
              <span class="menuText">Queue</span>
            </span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/logs">
            <span @click="closeLHN">
              <font-awesome-icon :icon="['fas', 'history']" />
              <span class="menuText">Logs</span>
            </span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </template>

  <script setup>
    import {ref, defineExpose} from 'vue';

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
    width: 200px;
    background-color: rgb(42, 42, 42);
    color: white;
    padding: 1rem;
    height: 100vh;
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
      width: calc(100% - 32px);;
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
    margin: 1rem 0;
  }
  
  .LeftHandNav a {
    color: white;
    text-decoration: none;
  }
  
  .LeftHandNav a:hover {
    font-weight: bold;
  }

  .menuText {
    margin-left: 1rem;
  }
  </style>