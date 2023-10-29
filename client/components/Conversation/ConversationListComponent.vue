<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import ConversationListItemComponent from "./ConversationListItemComponent.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);

type Conversation = {
  otherUser: string;
  date: Date;
  recentMessage: string;
};

const conversations = ref<Array<Conversation>>([]);

async function getConversations() {
  let conversationResults;
  try {
    conversationResults = await fetchy("/api/messages/conversations", "GET");
  } catch (_) {
    return;
  }
  conversations.value = conversationResults as Array<Conversation>;
}

onBeforeMount(async () => {
  await getConversations().then(() => (loaded.value = true));
});

const emit = defineEmits(["conversationClicked"]);
</script>

<template>
  <section class="conversation-list">
    <div v-if="loaded && conversations.length !== 0">
      <section v-for="conversation in conversations" :key="conversation.otherUser">
        <RouterLink :to="{ path: `/messages/${conversation.otherUser}` }">
          <ConversationListItemComponent :conversation="conversation" />
        </RouterLink>
      </section>
    </div>
    <p v-else-if="loaded">No messages found</p>
    <p v-else>Loading...</p>
  </section>
</template>

<style scoped>
.conversation-list {
  display: flex;
  flex-direction: column;
  gap: 1em;
  /* width: 100%; */
}

.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--primary-container);
  color: var(--on-primary-container);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  width: 80vw;
  max-width: 36em;
}

.posts {
  padding: 1em;
  align-items: center;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}

a,
a:hover,
a:visited,
a:active {
  color: inherit;
  text-decoration: none;
}
</style>
