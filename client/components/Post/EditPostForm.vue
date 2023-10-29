<script setup lang="ts">
import { hexFromArgb, themeFromImage, themeFromSourceColor } from "@material/material-color-utilities";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["post"]);
const content = ref(props.post.content);
const scheme = ref(themeFromSourceColor(0).schemes.light);

const emit = defineEmits(["editPost", "refreshPosts"]);

const assignButtonColor = (button: HTMLElement) => {
  if (button.classList.contains("button-error")) {
    button.style.backgroundColor = hexFromArgb(scheme.value.error);
    button.style.color = hexFromArgb(scheme.value.onError);
  } else if (button.classList.contains("pure-button-primary")) {
    button.style.backgroundColor = hexFromArgb(scheme.value.primary);
    button.style.color = hexFromArgb(scheme.value.onPrimary);
  } else {
    button.style.backgroundColor = hexFromArgb(scheme.value.secondary);
    button.style.color = hexFromArgb(scheme.value.onSecondary);
  }
};

async function setupPostTheme() {
  const albumArt = document.getElementById("album-art-" + props.post._id) as HTMLImageElement;
  const theme = await themeFromImage(albumArt);
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  scheme.value = systemDark ? theme.schemes.dark : theme.schemes.light;

  const post = document.getElementById("post-" + props.post._id)!;
  post.style.backgroundColor = hexFromArgb(scheme.value.primaryContainer);
  post.style.color = hexFromArgb(scheme.value.onPrimaryContainer);

  Array.from(post.getElementsByClassName("btn-small")).map((el) => assignButtonColor(el as HTMLElement));
}

// onMounted(() => {
//   void setupPostTheme();
// });

const editPost = async (content: string) => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "PATCH", { body: { update: { content: content } } });
  } catch (e) {
    return;
  }
  emit("editPost");
  emit("refreshPosts");
};
</script>

<template>
  <form @submit.prevent="editPost(content)">
    <p class="author">{{ props.post.author }}</p>
    <textarea id="content" v-model="content" placeholder="Create a post!" required> </textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editPost')">Cancel</button></li>
      </menu>
      <p v-if="props.post.dateCreated !== props.post.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
