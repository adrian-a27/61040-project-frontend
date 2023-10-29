import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import MessagesView from "../views/MessagesView.vue";
import MusicPlayerView from "../views/MusicPlayerView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import SettingsView from "../views/SettingsView.vue";
import ConversationView from "../views/ConversationView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/settings",
      name: "Settings",
      component: SettingsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/player",
      name: "Music Player",
      component: MusicPlayerView,
      meta: { requiresAuth: true },
    },
    {
      path: "/messages",
      name: "Messages",
      component: MessagesView,
      meta: { requiresAuth: true },
    },
    {
      path: "/messages/:username",
      name: "Conversation",
      component: ConversationView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach(async (to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
