<script setup lang="ts">
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { SongData, getSongBySpotifyId } from "@/utils/musicResource";
import { storeToRefs } from "pinia";
import { defineExpose, onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let tracks = ref<Array<SongData>>([]);
let editing = ref("");
let searchAuthor = ref("");

async function getFollowingPosts(author?: string) {
  let postResults;
  try {
    postResults = await fetchy("/api/posts/feed", "GET");
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  tracks.value = await Promise.all(postResults.map((post: Record<string, string>) => getSongBySpotifyId(post.songId)));
  posts.value = postResults;
}

const updateEditing = (id: string) => {
  editing.value = id;
};

const pausePlayingAudio = (playingId: string) =>
  Array.from(document.getElementsByClassName("post-audio")).map((audioElement) => {
    if (audioElement.id != "audio-source-" + playingId) (audioElement as HTMLAudioElement).pause();
  });

onBeforeMount(async () => {
  await getFollowingPosts().then(() => (loaded.value = true));
});

defineExpose({ getFollowingPosts });
</script>

<template>
  <!-- <div class="row">
    <h2 v-if="!searchAuthor">Posts:</h2>
    <h2 v-else>Posts by {{ searchAuthor }}:</h2>
    <SearchPostForm @getPostsByAuthor="getPosts" />
  </div> -->
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="(post, idx) in posts" :key="post._id" :id="'post-' + post._id">
      <PostComponent v-if="editing !== post._id" :post="post" :track="tracks[idx]" @refreshPosts="getFollowingPosts" @editPost="updateEditing" @playing-audio="pausePlayingAudio" />
      <EditPostForm v-else :post="post" @refreshPosts="getFollowingPosts" @editPost="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
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
</style>
