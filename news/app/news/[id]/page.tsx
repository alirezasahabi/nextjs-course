import { DUMMY_NEWS } from "@/dummy-news";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}
const NewsDetailsPage = async ({ params }: Props) => {
  const id = (await params).id;

  const news = DUMMY_NEWS.find((news) => news.id === id);

  if (!news) notFound();

  return (
    <article className="news-article">
      <header>
        <img src={`/images/news/${news?.image}`} alt={news?.title} />
        <h1>{news?.title}</h1>
        <time dateTime={news?.date}>{news?.date}</time>
      </header>
      <p>{news?.content}</p>
    </article>
  );
};

export default NewsDetailsPage;
