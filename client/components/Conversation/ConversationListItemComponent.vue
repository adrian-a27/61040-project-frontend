<script setup lang="ts">
const props = defineProps(["conversation"]);
</script>

<template>
  <section>
    <div class="user-icon material-symbols-outlined">person</div>
    <div class="conversation-peek">
      <div class="username">{{ props.conversation.otherUser }}</div>
      <div class="message">{{ props.conversation.recentMessage }}</div>
    </div>
  </section>
</template>

<style scoped>
section {
  padding: 8px 36px;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 16px;
  /* justify-content: space-around; */
  padding-bottom: 16px;
  border-bottom: 1px solid var(--surface-variant);
}

.user-icon {
  border: none;
  background-color: var(--tertiary-container);
  height: 24px;
  width: 24px;
  border-radius: 100%;
  padding: 8px;
  margin: 4px;
  font-size: 24px;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.conversation-peek {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.username {
  font-size: large;
}

.message {
  font-size: smaller;
}
</style>
