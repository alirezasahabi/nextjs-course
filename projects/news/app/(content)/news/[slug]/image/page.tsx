import { getNewsItem } from "@/lib/news";
import { notFound } from "next/navigation";

interface Props {
  /**
   * Nested rotues, inside dynamic routes will also have access to
   * that dynamic route parameter.
   */
  params: Promise<{ slug: string }>;
}
const ImagePage = async ({ params }: Props) => {
  const slug = (await params).slug;

  const newsItem = await getNewsItem(slug);

  if (!newsItem) notFound();

  return (
    <div className="fullscreen-image">
      <img src={`/images/news/${newsItem?.image}`} alt={newsItem?.title} />
    </div>
  );
};

export default ImagePage;
