<template>
  <div class="LeftHandNav" ref="lhn">
    <ul>
      <li class="mobileOnly pull-right">
        <font-awesome-icon :icon="['fas', 'xmark']" @click="toggleLHN" />
      </li>
      <LeftHandNavLink label="Queue" icon="tasks" path="/queue" @option-clicked="closeLHN" />
      <LeftHandNavLink label="Logs" icon="history" path="/logs" @option-clicked="closeLHN" />
      <LeftHandNavLink label="Settings" icon="gears" path="/settings" @option-clicked="closeLHN" />
      <LeftHandNavLink label="Synonyms" icon="arrows-rotate" path="/synonyms" @option-clicked="closeLHN" />
      <LeftHandNavLink label="Refresh Index" icon="address-book" noLink="true" @option-clicked="refreshCache" />
      <LeftHandNavLink label="About" icon="circle-info" path="/about" @option-clicked="closeLHN" />
      <LeftHandNavLink label="Logout" icon="sign-out" noLink="true" @option-clicked="logout" />
    </ul>
  </div>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from 'vue';
import { getHost } from '@/lib/utils';
import LeftHandNavLink from './LeftHandNavLink.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const lhn = ref(null);
const emit = defineEmits(['clear-search']);

const toggleLHN = () => {
  lhn.value.classList.toggle('show');
}

const closeLHN = () => {
  lhn.value.classList.remove('show');
  emit('clear-search');
}

defineExpose({ toggleLHN });

const logout = async () => {
  if (confirm("Are you sure you want to log out?")) {
    const response = await fetch(`${getHost()}/auth/logout`, { credentials: "include" });
    if (response.ok) {
      router.go(0);
    }
  }
}

const refreshCache = async () => {
  await fetch(`${getHost()}/json-api/cache-refresh`, { credentials: "include"});
  if(confirm("Cache Refresh Started, Would you like to view the logs?")){
    router.push("/logs");
  }
}
</script>

<style lang="less">
.LeftHandNav {
  width: 210px;
  background-color: @nav-background-color;
  color: @nav-text-color;
  height: 100vh;
  z-index: 3;
  font-size: 14px;
  flex-shrink: 0;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 12px 24px;

    &.active {
      background-color: @nav-active-background-color;
      color: @brand-color;
    }

    .menuText {
      margin-left: 1rem;
    }
  }

  a {
    color: @nav-link-color;
    text-decoration: none;

    &:hover {
      color: @brand-color;
    }
  }
}

@media (max-width: @mobile-breakpoint) {
  .LeftHandNav {
    display: none;

    &.show {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
    }

    li {
      border-bottom: 1px solid @nav-border-color;
      padding-bottom: 1rem;
    }
  }
}
</style>