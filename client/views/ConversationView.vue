<script setup lang="ts">
import SongSearchResults from "@/components/SongSearch/SongSearchResults.vue";
import { useUserStore } from "@/stores/user";
import { getSongBySpotifyId } from "@/utils/musicResource";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import SongResultEntry from "../components/SongSearch/SongResultEntry.vue";
import { fetchy } from "../utils/fetchy";

export type SongData = {
  songTitle: string;
  albumName: string;
  artists: string;
  image: string;
  preview_url: string | null;
  id: string;
};

type Message = {
  _id: string;
  sender: string;
  content: string | SongData;
};

type Thread = {
  otherUser: string;
  messages: Message[];
};

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const threadData = ref(<Thread>{});
const loaded = ref(false);
const content = ref("");
const openOverlay = ref(false);
const chosenSong = ref(<SongData>{});
const showResults = ref(false);
const songQuery = ref("");
const searchResults = ref(SongSearchResults);

const emit = defineEmits(["refreshMessages"]);

async function loadConversation(otherUser: string) {
  let threadResults;
  try {
    threadResults = await fetchy(`/api/messages/conversations/${otherUser}`, "GET");
  } catch (_) {
    return;
  }
  const messages: Message[] = [];

  threadData.value = { otherUser: otherUser, messages: [] };
  for (const m of threadResults) {
    if (m.content.startsWith("<@spotifyId>")) {
      messages.push({ _id: m._id, sender: m.sender, content: await getSongBySpotifyId((m.content as string).slice(12)) });
    } else {
      messages.push({ _id: m._id, sender: m.sender, content: m.content });
    }

    // messages.push({ _id: m._id, sender: m.sender, content: m.content });
  }

  messages.reverse();
  threadData.value.messages = messages;
}

async function sendMessage() {
  if (threadData.value.otherUser !== "" && content.value !== "") {
    try {
      await fetchy("/api/messages", "POST", {
        body: { recipient_username: threadData.value.otherUser, content: content.value },
      });
    } catch (_) {
      return;
    }
    emptyForm();
    await loadConversation(threadData.value.otherUser);
  } else {
    console.log("ERROR: Enter message first!");
  }
}

const emptyForm = () => {
  content.value = "";
  chosenSong.value = <SongData>{};
  openOverlay.value = false;
};

const chooseResult = async (songData: SongData) => {
  chosenSong.value = songData;
  songQuery.value = "";
};

onBeforeMount(async () => {
  const route = useRoute();
  await loadConversation(route.params.username as string).then(() => (loaded.value = true));
});

const sendSong = async () => {
  try {
    await fetchy("/api/messages", "POST", {
      body: { recipient_username: threadData.value.otherUser, content: `<@spotifyId>${chosenSong.value.id}` },
    });
  } catch (_) {
    return;
  }
  emptyForm();
  void loadConversation(threadData.value.otherUser);
};
</script>

<template>
  <main>
    <div class="thread-header">
      <RouterLink :to="{ name: 'Messages' }"><span class="material-symbols-outlined close-thread-button" style="cursor: pointer">arrow_back</span></RouterLink>
      <div class="user-info">
        <div class="user-icon material-symbols-outlined">person</div>
        <div class="username">{{ threadData.otherUser }}</div>
      </div>
    </div>

    <section v-if="loaded && threadData.messages.length !== 0" class="message-bubbles">
      <article v-for="m in threadData.messages" :key="m._id">
        <SongResultEntry
          v-if="m.content.hasOwnProperty('id')"
          class="song-bubble message-bubble"
          :class="m.sender === currentUsername ? 'user-message' : 'other-message'"
          :songResult="m.content as SongData"
          :showButton="false"
        />
        <div v-else class="message-bubble" :class="m.sender === currentUsername ? 'user-message' : 'other-message'">{{ m.content }}</div>
      </article>
    </section>

    <p v-else-if="loaded">No messages found</p>
    <p v-else>Loading...</p>

    <div class="bottom-bar">
      <div class="music-library-button material-symbols-outlined" @click="openOverlay = true">library_music</div>
      <textarea id="message-box" v-model="content" placeholder="Text message" required />
      <div class="send-button material-symbols-outlined" type="submit" @click="sendMessage">send</div>

      <div class="overlay" v-if="openOverlay">
        <div class="user-select-screen">
          <span class="close-button material-symbols-outlined" @click="openOverlay = false">close</span>
          <h3>Send a song</h3>
          <div id="song-search">
            <input
              type="text"
              id="song-search-bar-post"
              v-model="songQuery"
              placeholder="Search for a song..."
              @keyup="searchResults.generateResults"
              @focus="showResults = true"
              @blur="showResults = false"
              v-if="!chosenSong.id"
              required
            />
            <SongResultEntry :songResult="chosenSong" v-if="chosenSong.id" :showButton="true" @deleteResult="() => (chosenSong = <SongData>{})" />
            <SongSearchResults v-show="showResults" ref="searchResults" :query="songQuery" @selectResult="chooseResult" />
            <button type="submit" class="pure-button-primary pure-button send-song-btn" @click="sendSong">Send</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.song-bubble {
  width: 65vw;
}

main {
  padding: 8px 36px;
  display: flex;
  height: 10vh;
  flex-direction: column;
  align-items: center;
  align-content: center;
  /* justify-content: center; */
  gap: 32px;
}

.thread-header {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-around;
  padding-top: 8px;
  /* border: 1px solid red; */
}

.user-info {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  gap: 8px;
}

.user-icon {
  border: none;
  background-color: var(--tertiary-container);
  height: 24px;
  width: 24px;
  border-radius: 100%;
  padding: 8px;
  font-size: 24px;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.username {
  font-size: large;
}
.send-song-btn {
  margin-top: 8px;
  position: relative;
  max-width: 25em;
  width: 45vw;
  align-self: center;
}

.music-library-button {
  background-color: var(--tertiary-container);
  color: var(--on-tertiary-container);
  width: 24px;
  height: 24px;
  border-radius: 8px;
  text-align: center;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  margin: 4px;
}

.send-button {
  background-color: var(--secondary-container);
  color: var(--on-secondary-container);
  width: 24px;
  height: 24px;
  border-radius: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  margin: 4px;
}

.bottom-bar {
  position: fixed;
  bottom: 80px;

  width: 90vw;
  height: 56px;
  padding: 8px;
  /* margin: 0 16px 16px 0; */
  /* border: 1px solid red; */

  display: flex;
  align-items: center;
  gap: 8px;
}

#message-box {
  height: 32px;
  width: 100%;
  border-radius: 16px;
  padding: 4px 16px;
  resize: none;
  line-height: 28px;
}

.message-bubbles {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  /* align-content: flex-start; */
  /* flex: 1; */
  gap: 8px;
}

.message-bubble {
  padding: 8px 16px;
  border-radius: 16px;
}

.user-message {
  background-color: var(--primary);
  color: var(--on-primary);
  float: right;
}

.other-message {
  background-color: var(--primary-container);
  color: var(--on-primary-container);
  float: left;
}

h1 {
  text-align: left;
}

a,
a:hover,
a:visited,
a:active {
  color: inherit;
  text-decoration: none;
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
  width: 60vw;
  max-width: 25em;
  padding: 16px;
  border-radius: 16px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* gap: 80px; */
}

.close-button {
  align-self: flex-start;
  cursor: pointer;
}

#song-search {
  position: relative;
  display: flex;
  flex-direction: column;

  width: 60vw;
  max-width: 25em;
}

#song-search-bar-post {
  margin-bottom: 8px;
}
</style>
