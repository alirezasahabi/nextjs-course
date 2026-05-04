import { DUMMY_NEWS } from "@/dummy-news";
import { notFound } from "next/navigation";

interface Props {
  /**
   * Nested rotues, inside dynamic routes will also have access to
   * that dynamic route parameter.
   */
  params: Promise<{ id: string }>;
}
const ImagePage = async ({ params }: Props) => {
  const id = (await params).id;

  const news = DUMMY_NEWS.find((news) => news.id === id);

  if (!news) notFound();

  return (
    <div className="fullscreen-image">
      <img src={`/images/news/${news?.image}`} alt={news?.title} />
    </div>
  );
};

export default ImagePage;
