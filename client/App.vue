<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <article v-if="toast !== null" class="toast" :class="toast.style">
    <p>{{ toast.message }}</p>
  </article>
  <RouterView class="content" />
  <nav v-show="currentRouteName != 'Login'">
    <RouterLink :to="{ name: 'Home' }">
      <div id="home-button" class="nav-target" :class="{ active_target: currentRouteName == 'Home' }">
        <div class="target_overlay">
          <div class="material-symbols-outlined nav-target-icon">home</div>
        </div>
        <div class="nav-target-text">Home</div>
      </div></RouterLink
    >
    <RouterLink :to="{ name: 'Music Player' }">
      <div id="music-player-button" class="nav-target" :class="{ active_target: currentRouteName == 'Music Player' }">
        <div class="target_overlay">
          <div class="material-symbols-outlined nav-target-icon">radio</div>
        </div>
        <div class="nav-target-text">Music</div>
      </div></RouterLink
    >
    <RouterLink :to="{ name: 'Messages' }">
      <div id="messages-button" class="nav-target" :class="{ active_target: currentRouteName == 'Messages' }">
        <div class="target_overlay">
          <div class="material-symbols-outlined nav-target-icon">lyrics</div>
        </div>
        <div class="nav-target-text">Messages</div>
      </div></RouterLink
    >
    <RouterLink :to="{ name: 'Settings' }">
      <div id="settings-button" class="nav-target" :class="{ active_target: currentRouteName == 'Settings' }">
        <div class="target_overlay">
          <div class="material-symbols-outlined nav-target-icon">settings</div>
        </div>
        <div class="nav-target-text">Settings</div>
      </div></RouterLink
    >
  </nav>
</template>

<style scoped>
@import "./assets/toast.css";

.content {
  margin-bottom: 80px;
  /* background-color: var(--surface); */
}

nav {
  align-items: center;
  flex-direction: row;
  justify-content: space-around;

  background-color: lightgray;
  display: flex;

  position: fixed;
  bottom: 0;
  width: 100%;
  padding-top: 12px;
  padding-bottom: 16px;
  gap: 8px;

  background-color: var(--surface);
}

.nav-target {
  align-items: center;
  justify-content: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 48px;
  min-height: 48px;
}

.nav-target-icon {
  width: 24px;
  height: 24px;
  line-height: 32px;
  color: var(--on-surface-variant);
}

.nav-target-text {
  width: auto;
  color: var(--on-surface-variant);
}

.nav-target:hover {
  cursor: pointer;
}

.target_overlay {
  width: 64px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-content: center;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 16px;
}

.target_overlay:hover {
  background-color: rgba(0, 0, 0, 0.175);
}

.active_target {
  .target_overlay {
    background-color: var(--secondary-container);
  }

  .nav-target-icon {
    color: var(--on-secondary-container);
  }

  .nav-target-text {
    color: var(--on-surface);
  }

  .material-symbols-outlined {
    font-variation-settings: "FILL" 1;
  }
}

a {
  font-size: small;
  color: black;
  text-decoration: none;
}
</style>
