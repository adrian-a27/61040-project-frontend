import { User } from "./app";
import { FollowRequestDoc } from "./concepts/followGraph";
import { PostAuthorNotMatchError, PostDoc } from "./concepts/post";
import { StatusDoc } from "./concepts/status";
import { Router } from "./framework/router";

/**
 * This class does useful conversions for the frontend.
 * For example, it converts a {@link PostDoc} into a more readable format for the frontend.
 */
export default class Responses {
  /**
   * Convert PostDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async post(post: PostDoc | null) {
    if (!post) {
      return post;
    }
    const author = await User.getUserById(post.author);
    return { ...post, author: author.username };
  }

  /**
   * Same as {@link post} but for an array of PostDoc for improved performance.
   */
  static async posts(posts: PostDoc[]) {
    const authors = await User.idsToUsernames(posts.map((post) => post.author));
    return posts.map((post, i) => ({ ...post, author: authors[i] }));
  }

  /**
   * Same as {@link post} but for an array of StatusDoc for improved performance.
   */
  static async statuses(statuses: StatusDoc[]) {
    const users = await User.idsToUsernames(statuses.map((status) => status.user));
    return statuses.map((status, i) => ({ ...status, user: users[i] }));
  }

  /**
   * Convert FriendRequestDoc into more readable format for the frontend
   * by converting the ids into usernames.
   */
  static async socialRequests(requests: FollowRequestDoc[]) {
    const from = requests.map((request) => request.from);
    const to = requests.map((request) => request.to);
    const usernames = await User.idsToUsernames(from.concat(to));
    const type = requests.map((request) => request.type);
    return requests.map((request, i) => ({ ...request, from: usernames[i], to: usernames[i + requests.length], type: type[i] }));
  }
}

Router.registerError(PostAuthorNotMatchError, async (e) => {
  const username = (await User.getUserById(e.author)).username;
  return e.formatWith(username, e._id);
});
