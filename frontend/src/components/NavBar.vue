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

</style>
