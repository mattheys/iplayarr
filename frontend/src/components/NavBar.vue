<template>
    <div class="NavBar">
        <div class="left">
            <div class="logoPanel">
                <img src="/iplayarr.png" alt="Logo">
                <p>iPlayarr</p>
            </div>
        </div>
        <div class="middle">

        </div>
        <div class="right">
            <font-awesome-icon class="mobileOnly clickable" @click="toggleLeftHandNav" :icon="['fas', 'bars']" />
        </div>
    </div>
</template>

<script setup>
    import { inject } from 'vue';

    const toggleLeftHandNav = inject('toggleLeftHandNav');
</script>

<style scoped>
    .NavBar {
        display: flex;
        padding: 0px 1rem;
        background-color: rgb(42, 42, 42);
    }

    .NavBar div {
        flex: 1;
    }

    .NavBar .right {
        text-align: right;
    }

    .logoPanel {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .logoPanel img {
        width: 32px;
        height: auto;
    }

    .logoPanel p {
        font-size: 16px;
        font-weight: bold;
    }

</style>