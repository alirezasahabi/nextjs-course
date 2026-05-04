import Link from "next/link";

const BlogPage = () => {
  return (
    <main>
      <h1>Posts</h1>
      <p>
        <Link href="/blog/post-1">Posts 1</Link>
      </p>
      <p>
        <Link href="/blog/post-2">Posts 2</Link>
      </p>
    </main>
  );
};

export default BlogPage;
