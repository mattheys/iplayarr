<template>
    <div class="LeftHandNav">
      <ul>
        <li>
          <RouterLink to="/queue">
            <font-awesome-icon :icon="['fas', 'tasks']" />
            <span class="menuText">Queue</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/logs">
            <font-awesome-icon :icon="['fas', 'history']" />
            <span class="menuText">Logs</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </template>
  
  <style scoped>
  .LeftHandNav {
    width: 200px;
    background-color: rgb(42, 42, 42);
    color: white;
    padding: 1rem;
    height: 100vh;
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