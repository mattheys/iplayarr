<template>
    <div class="NavBar">
        <div class="left">
            iPlayarr
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
        padding: 1rem;
        background-color: rgb(42, 42, 42);
    }

    .NavBar div {
        flex: 1;
    }

    .NavBar .right {
        text-align: right;
    }
</style>