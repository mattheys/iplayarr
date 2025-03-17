<template>
    <button class="listButton clickable" v-for="item in items" v-bind:key="JSON.stringify(item)">
        <slot :item="item"></slot>
        <div class="actionContainer">
            <button class="clickable" v-for="action in actions" @click="action[1](item)" v-bind:key="action[0]">
                <font-awesome-icon :icon="['fas', action[0]]" />
            </button>
        </div>
    </button>
    <button class="listButton listAddButton clickable" @click="emit('create')">
        <div class="addButtonCenter">
            <font-awesome-icon :icon="['fas', 'plus']" />
        </div>
    </button>
</template>

<script setup>
    import {defineProps, defineEmits} from 'vue';

    const emit = defineEmits(['create'])

    defineProps({
        showAdd : Boolean,
        items : Array,
        actions : Array
    });
</script>

<style lang="less">
    .listButton {
        width: 290px;
        background-color: @nav-active-background-color;

        position: relative;
        margin: 10px;
        padding: 10px;
        border-radius: 3px;
        box-shadow: 0 0 10px 1px @primary-box-shadow;

        outline: none;
        border: 0;
        text-decoration: none;
        text-align: left;
        color: @primary-text-color;
        height: 100px;

        @media (min-width: @mobile-breakpoint) {
            float: left;
        }

        @media (max-width: @mobile-breakpoint) {
            display: block;
            margin-left: auto;
            margin-right: auto;
        }

        &.listAddButton {
            text-align: center;

            .addButtonCenter {
                display: inline-block;
                padding: 5px 20px 0;
                border: 1px solid @table-border-color;
                border-radius: 4px;
                background-color: @nav-background-color;
                color: white;
                font-size: 45px;
            }
        }

        .major {
            font-size: 20px;
        }

        .minor {
            font-size: 16px;
        }

        .sub {
            font-size: 14px;
        }

        .actionContainer {
            text-align: right;
            position: absolute;
            width: 270px;
            bottom: 0px;
            padding-bottom: 0.5rem;

            button {
                background: none;
                border: none;
                color: white;
            }
        }
    }
</style>