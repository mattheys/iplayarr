<template>
    <div class="navBar">
        <div class="left">
            <img src="/iplayarr.png"/>
        </div>
        <div class="middle">Middle</div>
        <div class="right">Menu</div>
    </div>
</template>

<style scoped>
* {
    box-sizing: border-box;
}

.navBar {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    top: 0;
    left: 0;
    padding: 1rem;
    background-color: rgb(42, 42, 42);
}

.navBar .left img {
    height: 40px;
}

.navBar .middle {
    flex-grow: 1;
    text-align: center;
}


.navBar div {
    flex: 1;
}

.left {
    text-align: left;
}

.middle {
    text-align: center;
}

.right {
    text-align: right;
}
</style>