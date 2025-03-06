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
            <div class="searchPanel" v-if="authState.user">
                <font-awesome-icon :icon="['fas', 'search']"/>
                <input class="searchBox" type="text" placeholder="Search" @keyup.enter="search" v-model="searchTerm"/>
            </div>
        </div>
        <div class="right">
            <font-awesome-icon class="mobileOnly clickable" @click="toggleLeftHandNav" :icon="['fas', 'bars']" v-if="authState.user"/>
        </div>
    </div>
</template>

<script setup>
    import { inject, ref } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const toggleLeftHandNav = inject('toggleLeftHandNav');
    const authState = inject("authState");

    const searchTerm = ref("");

    const search = () => {
        router.push({ name : 'search', query : {searchTerm : searchTerm.value}});
        searchTerm.value = "";
    }
</script>

<style scoped>
    .NavBar {
        display: flex;
        padding: 0px 20px;
        background-color: rgb(42, 42, 42);
        height: 60px;
    }

    @media (min-width: 768px) {
        .NavBar .left, .NavBar .right {
            flex: 0 0 210px;
        }
        
        .NavBar .middle {
            flex: 1;
            justify-content: flex-start;
        }
    }

    @media (max-width: 768px) {
        .NavBar div {
            flex: 1;
        }

        .NavBar .middle {
            padding: 0 1rem;
        }
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
    .searchPanel {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 100%;
    }

    .searchBox {
        background-color: transparent;
        border: 0px;
        border-bottom: 1px solid white;
        padding: 5px 5px;
        color: white;
        transition: border-bottom-color 0.3s ease-out;
    }

    .searchBox:focus {
        outline: none;
        box-shadow: none;
        border-bottom-color: transparent;
    }

    .searchBox:focus::placeholder {
        color: transparent;
    }

</style>
