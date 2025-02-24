<template>
    <nav class="sidebar">
        <ul>
            <li><router-link to="/Sonarr">Sonarr</router-link></li>
            <li><router-link to="/Radarr">Radarr</router-link></li>
        </ul>
    </nav>
</template>

<style scoped>
.sidebar {
    position: relative;
    top: 0;
    left: 0;
    width: 200px;
    height: 100vh;
    /* Full height */
    background-color: #333;
    padding: 20px;
    box-sizing: border-box;
}

.sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.sidebar ul li {
    margin-bottom: 15px;
}

.sidebar ul li a {
    color: white;
    text-decoration: none;
    display: block;
    padding: 10px;
    border-radius: 4px;
}

.sidebar ul li a:hover {
    background-color: #555;
}
</style>