"use client";

import { useOptimistic } from "react";
import { togglePostLikeStatus } from "@/actions/posts";
import { formatDate } from "@/lib/format";
import LikeButton from "./like-icon";
import { Post } from "@/lib/posts";

interface Props {
  post: Post;
  action: (postId: number) => Promise<void>;
}
function PostItem({ post, action }: Props) {
  return (
    <article className="post">
      <div className="post-image">
        <img src={post.image} alt={post.title} />
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{" "}
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </p>
          </div>
          <div>
            {/*
             * A method that we can call on function objects to (pre-configure)
             * define some values that will be passed to that function
             * in the future when it's executed.
             *
             * @param thisArg — The object to be used as the this object.
             * @param args — Arguments to bind to the parameters of the function.
             * The argument that we pass to bind will then
             * become the new first argument when that function is executed.
             * normally:  action(formData)
             * with bind: action(post.id, formData)
             *
             */}
            <form
              action={action.bind(null, post.id)}
              className={post.isLiked ? "liked" : ""}
            >
              <LikeButton />
            </form>
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

export default function Posts({ posts }: { posts: Post[] }) {
  const [optimisticPosts, updateOptimisticPosts] = useOptimistic(
    posts,
    (prevPosts, updatedPostId: number) => {
      const updatedPostIndex = prevPosts.findIndex(
        (post) => post.id === updatedPostId,
      );

      if (updatedPostIndex === -1) return prevPosts;

      const updatedPost = { ...prevPosts[updatedPostIndex] };
      updatedPost.isLiked = !updatedPost.isLiked;
      updatedPost.likes += updatedPost.isLiked ? 1 : -1;

      const newPosts = [...prevPosts];
      newPosts[updatedPostIndex] = updatedPost;

      return newPosts;
    },
  );

  async function updatePost(postId: number) {
    updateOptimisticPosts(postId);
    await togglePostLikeStatus(postId);
  }

  if (!optimisticPosts || optimisticPosts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  return (
    <ul className="posts">
      {optimisticPosts.map((post) => (
        <li key={post.id}>
          <PostItem post={post} action={updatePost} />
        </li>
      ))}
    </ul>
  );
}
