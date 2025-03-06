<template>
    <div class="NavBar">
        <div class="left">
            <div class="logoPanel">
                <RouterLink to="/queue">
                    <img src="/iplayarr.png" alt="Logo">
                    <p>iPlayarr</p>
                </RouterLink>
            </div>
        </div>
        <div class="middle">

        </div>
        <div class="right">
            <font-awesome-icon class="mobileOnly clickable" @click="toggleLeftHandNav" :icon="['fas', 'bars']" v-if="authState.user"/>
            <a href="https://ko-fi.com/nikorag" aria-label="Donate" class="donateLink" target="_blank" v-if="!hiddenSettings.HIDE_DONATE">
                <font-awesome-icon class="desktopOnly clickable" :icon="['fas', 'heart']" v-if="authState.user"/>
            </a>
            <a href="https://github.com/Nikorag/iplayarr" aria-label="GitHub" target="_blank">
                <font-awesome-icon class="desktopOnly clickable" :icon="['fab', 'github']" v-if="authState.user"/>
            </a>
        </div>
    </div>
</template>

<script setup>
    import { inject } from 'vue';

    const toggleLeftHandNav = inject('toggleLeftHandNav');
    const authState = inject("authState");
    const hiddenSettings = inject("hiddenSettings");
</script>

<style scoped>
    .NavBar {
        display: flex;
        padding: 0px 20px;
        background-color: rgb(42, 42, 42);
        height: 60px;
    }

    .NavBar div {
        flex: 1;
    }

    .NavBar .right {
        text-align: right;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .logoPanel, .logoPanel a {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 100%;
    }

    .logoPanel img {
        width: 32px;
        height: auto;
    }

    .logoPanel p {
        font-size: 16px;
        font-weight: bold;
    }
    .right a {
        width: 30px;
        height: 60px;
        text-align: center;
        display: flex;
        align-items: center;
    }
    .donateLink {
        color: red;
    }
</style>
