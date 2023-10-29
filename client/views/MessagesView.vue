<script setup lang="ts">
import ConversationListComponent from "@/components/Conversation/ConversationListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../utils/fetchy";

type Message = {
  _id: string;
  sender: string;
  content: string;
};

type Thread = {
  otherUser: string;
  messages: Message[];
};

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const openOverlay = ref(false);
const friends = ref([] as string[]);
const recipient = ref("");

const getFriends = async () => {
  let friendValues;
  try {
    friendValues = await fetchy("/api/friends", "GET");
  } catch (_) {
    return;
  }

  friends.value = friendValues;
};

onBeforeMount(async () => {
  void getFriends();
});
</script>

<template>
  <main>
    <h1>What are we talking about?</h1>
    <ConversationListComponent />
    <button id="new-convo-fab" class="material-symbols-outlined" @click="openOverlay = true">edit</button>
    <div class="overlay" v-if="openOverlay">
      <div class="user-select-screen">
        <span class="close-button material-symbols-outlined" @click="openOverlay = false">close</span>
        <h3>New conversation</h3>
        <form>
          <select class="recipient" v-model="recipient">
            <option v-for="friend in friends" :key="friend" :value="friend">{{ friend }}</option>
          </select>
          <RouterLink :to="{ path: `/messages/${recipient}` }"><button type="submit" class="pure-button-primary pure-button select-recipient-btn">Start a conversation</button></RouterLink>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
}

h1 {
  text-align: left;
  padding: 8px 36px;
}

h3 {
  margin-top: 4px;
  margin-bottom: 16px;
}

#new-convo-fab {
  position: fixed;
  bottom: 80px;
  right: 0;

  border: none;
  background-color: var(--tertiary-container);
  color: var(--on-tertiary-container);

  font-size: 24px;
  border-radius: 16px;
  width: 56px;
  height: 56px;
  margin: 0 16px 16px 0;
  cursor: pointer;
}

.overlay {
  position: fixed; /* Sit on top of the page content */
  display: flex;
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Black background with opacity */
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
}

.user-select-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  background-color: var(--surface-variant);
  color: var(--on-surface-variant);
  width: 45vw;
  max-width: 25em;
  padding: 16px;
  border-radius: 16px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* gap: 80px; */
}

.recipient {
  position: relative;
  width: 45vw;
  max-width: 25em;

  margin-bottom: 16px;
  height: 32px;
  border-radius: 16px;
  padding: 0px 8px;
}

.select-recipient-btn {
  position: relative;
  max-width: 25em;
  width: 45vw;
}

.close-button {
  align-self: flex-start;
  cursor: pointer;
}
</style>
