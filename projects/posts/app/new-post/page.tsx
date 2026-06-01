import { redirect } from "next/navigation";
import { storePost } from "@/lib/posts";
import PostForm from "@/components/post-form";

export default function NewPostPage() {
  async function createPost(_: { errors?: string[] }, formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const image = formData.get("image") as File;
    const content = formData.get("content") as string;

    const errors: string[] = [];

    if (!title || !title.trim().length) errors.push("Title is required");

    if (!content || !content.trim().length) errors.push("Content is required");

    if (!image || image.size === 0) errors.push("Image is required");

    if (errors.length > 0) return { errors };

    const post = {
      userId: 1,
      title,
      imageUrl: "",
      content,
    };

    await storePost(post);

    redirect("/feed");
  }

  return <PostForm createPost={createPost} />;
}
