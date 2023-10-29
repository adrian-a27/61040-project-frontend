<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const isCreatingPost = ref(false);
const postList = ref(PostListComponent);

const showPostCreationSheet = () => (isCreatingPost.value = true);
const closePostCreationSheet = () => (isCreatingPost.value = false);
</script>

<template>
  <main>
    <h1>What's everyone talking about?</h1>
    <CreatePostForm v-if="isCreatingPost" @refreshPosts="postList.getFollowingPosts()" @close-sheet="closePostCreationSheet" />
    <PostListComponent :showPostCreationSheet="isCreatingPost" ref="postList" />
    <button v-if="!isCreatingPost" id="new-post-fab" class="material-symbols-outlined" @click="showPostCreationSheet">edit</button>
  </main>
</template>

<style scoped>
main {
  padding: 8px 36px;
}

h1 {
  text-align: left;
}

#new-post-fab {
  position: fixed;
  bottom: 80px;
  right: 0;

  border: none;
  background-color: var(--primary-container);
  color: var(--on-primary-container);

  font-size: 24px;
  border-radius: 16px;
  width: 56px;
  height: 56px;
  margin: 0 16px 16px 0;
  cursor: pointer;
}

</style>
