<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const { currentUsername } = storeToRefs(useUserStore());

type User = {
  _id: string;
  username: string;
};

const allUsers = ref([] as User[]);
const following = ref(new Set<string>());
const followers = ref(new Set<string>());
const friends = ref(new Set<string>());
const friendRequestsFrom = ref(new Set<string>());
const friendRequestsTo = ref(new Set<string>());
const followRequestsFrom = ref(new Set<string>());
const followRequestsTo = ref(new Set<string>());
const requests = ref(new Set<string>());
const requestsTo = ref(new Set<string>());
const requestsFrom = ref(new Set<string>());

const focusedUser = ref("");

const getAllUsers = async () => {
  let userVals;
  try {
    userVals = await fetchy("/api/users", "GET");
  } catch (_) {
    return;
  }

  allUsers.value = userVals.filter((u: User) => u.username !== currentUsername.value);
};

const getFriends = async () => {
  let friendValues;
  try {
    friendValues = await fetchy("/api/friends", "GET");
  } catch (_) {
    return;
  }

  friends.value = new Set(friendValues);
};

const getFollowing = async () => {
  let followingValues;
  try {
    followingValues = await fetchy("/api/following", "GET");
  } catch (_) {
    return;
  }

  following.value = new Set(followingValues);
};

const getFollowers = async () => {
  let followerValues;
  try {
    followerValues = await fetchy("/api/followers", "GET");
  } catch (_) {
    return;
  }

  followers.value = new Set(followerValues);
};

const getRequests = async () => {
  let requestValues;
  try {
    requestValues = await fetchy("/api/user/requests", "GET");
  } catch (_) {
    return;
  }

  for (const r of requestValues) {
    if (r.type === "FOLLOW") {
      if (r.from === currentUsername.value) {
        followRequestsFrom.value.add(r.to);
      } else {
        followRequestsTo.value.add(r.from);
      }
    } else {
      if (r.from === currentUsername.value) {
        friendRequestsFrom.value.add(r.to);
      } else {
        friendRequestsTo.value.add(r.from);
      }
    }
  }

  requestsTo.value = new Set<string>([...followRequestsTo.value, ...friendRequestsTo.value]);
  requestsFrom.value = new Set<string>([...followRequestsFrom.value, ...friendRequestsFrom.value]);
  requests.value = new Set<string>([...requestsFrom.value, ...requestsTo.value]);
};

const canSendFriendRequest = ref(false);
const canSendFollowRequest = ref(false);
const isActiveRequest = ref(false);
const isAFollower = ref(false);
const isFollowing = ref(false);

const calculateBooleans = () => {
  const userToCheck = focusedUser.value;

  canSendFriendRequest.value = !requests.value.has(userToCheck) && !friends.value.has(userToCheck);
  canSendFollowRequest.value = !requestsFrom.value.has(userToCheck) && !following.value.has(userToCheck);
  isActiveRequest.value = requestsTo.value.has(userToCheck);
  isAFollower.value = followers.value.has(userToCheck);
  isFollowing.value = following.value.has(userToCheck);
};

const sendFollowRequest = async () => {
  try {
    await fetchy(`/api/following/request/${focusedUser.value}`, "POST");
  } catch (_) {
    return;
  }
  void setupPage();
};

const sendFriendRequest = async () => {
  try {
    await fetchy(`/api/friend/request/${focusedUser.value}`, "POST");
  } catch (_) {
    return;
  }
  void setupPage();
};

const acceptRequest = async () => {
  try {
    await fetchy(`/api/user/requests/accept/${focusedUser.value}`, "POST");
  } catch (_) {
    return;
  }
  void setupPage();
};

const rejectRequest = async () => {
  try {
    await fetchy(`/api/user/requests/reject/${focusedUser.value}`, "POST");
  } catch (_) {
    return;
  }
  void setupPage();
};

const removeFollowerOrFriend = async () => {
  const isFriend = friends.value.has(focusedUser.value);
  try {
    if (isFriend) {
      await fetchy(`/api/friends/${focusedUser.value}`, "DELETE");
    } else {
      await fetchy(`/api/followers/${focusedUser.value}`, "DELETE");
    }
  } catch (_) {
    return;
  }
  void setupPage();
};

const stopFollowing = async () => {
  try {
    await fetchy(`/api/following/${focusedUser.value}`, "DELETE");
  } catch (_) {
    return;
  }
  void setupPage();
};

const setupPage = () => {
  void getAllUsers();
  void getFriends();
  void getFollowing();
  void getFollowers();
  void getRequests();
};

onBeforeMount(async () => {
  await setupPage();
});
</script>

<template>
  <h2>Manage User Relationships</h2>
  <form>
    <select class="recipient" v-model="focusedUser" @change="calculateBooleans">
      <option v-for="user in allUsers" :key="user._id" :value="user.username">{{ user.username }}</option>
    </select>
    <button v-if="canSendFollowRequest" type="submit" class="pure-button pure-button-primary" @click="sendFollowRequest">Send Follow Request</button>
    <button v-if="canSendFriendRequest" type="submit" class="pure-button pure-button-primary" @click="sendFriendRequest">Send Friend Request</button>
    <button v-if="isActiveRequest" type="submit" class="pure-button pure-button-primary" @click="acceptRequest">Accept Request</button>
    <button v-if="isActiveRequest" type="submit" class="pure-button button-error" @click="rejectRequest">Reject Request</button>
    <button v-if="isAFollower" type="submit" class="pure-button button-error" @click="removeFollowerOrFriend">Remove Follower/Friend</button>
    <button v-if="isFollowing" type="submit" class="pure-button button-error" @click="stopFollowing">Stop Following</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

button {
  min-width: 15em;
}

select {
  width: 12em;
}
</style>
