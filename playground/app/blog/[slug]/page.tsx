/**
 * Dynamic Routes
 * To create a dynamic route in NextJS, we create a folder & to name this folder,
 * we use square brackets([]) where we then put any placeholder, identifier
 * of our choice inside these brackets.
 * This square brackets here simply tells NextJS that we want to have some path segments
 * that we don't know the exact value of the segment yet.
 */

/**NextJS passes a props object to all these page components. */
interface Props {
  /**
   * All these components get one special prop.
   * This will be an object where every that we had in such a dynamic route here
   * will be a key(In this case "slug") & the value stored under that key will be
   * the concrete value encoded in the URL.
   *
   */
  params: { slug: string };
}
const BlogPostPage = ({ params: { slug } }: Props) => {
  return (
    <main>
      <h1>BlogPostPage</h1>
      <p>{slug}</p>
    </main>
  );
};

export default BlogPostPage;
