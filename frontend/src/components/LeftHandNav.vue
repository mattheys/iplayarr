<template>
  <div class="LeftHandNav" ref="lhn">
    <ul>
      <LeftHandNavLink label="Queue" icon="tasks" path="/queue" @option-clicked="closeLHN" />
      <LeftHandNavLink label="Logs" icon="history" path="/logs" @option-clicked="closeLHN" />
      <LeftHandNavLink label="Settings" icon="gears" path="/settings" @option-clicked="closeLHN" />
      <LeftHandNavLink label="Synonyms" icon="arrows-rotate" path="/synonyms" @option-clicked="closeLHN" />
      <LeftHandNavLink label="Off Schedule" icon="calendar" path="/offSchedule" @option-clicked="closeLHN" />
      <LeftHandNavLink label="Refresh Index" icon="address-book" :noLink="true" @option-clicked="refreshCache" />
      <LeftHandNavLink label="About" icon="circle-info" path="/about" @option-clicked="closeLHN" />
      <LeftHandNavLink label="Logout" icon="sign-out" :noLink="true" @option-clicked="logout" />
    </ul>
  </div>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from 'vue';
import LeftHandNavLink from './LeftHandNavLink.vue';
import { useRouter } from 'vue-router';
import { ipFetch } from '@/lib/ipFetch';
import { onBeforeRouteLeave } from 'vue-router';

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
    const response = await ipFetch('json-api/auth/login');
    if (response.ok) {
      router.go(0);
    }
  }
}

const refreshCache = async () => {
  if (confirm("Are you sure you want to refresh the index?")) {
    await ipFetch('json-api/cache-refresh');
    if (confirm("Cache Refresh Started, Would you like to view the logs?")) {
      router.push("/logs");
    }
  }
}

onBeforeRouteLeave(() => {
  closeLHN();
})
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
      border-left: 3px solid @brand-color;

      padding-left: 21px;

      a, span {
        color: @brand-color !important;
        text-decoration: none;
      }
    }

    .menuText {
      margin-left: 1rem;
    }
  }

  a, span {
    color: @nav-link-color;
    text-decoration: none;

    &:hover {
      color: @brand-color;
    }
  }
}

@media (max-width: @mobile-breakpoint) {
  .LeftHandNav {
    position: absolute;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    display: block;
  }

  .LeftHandNav.show {
    transform: translateX(0);
  }
}

</style>