import NewsList from "@/components/news-list";
import { getAllNews } from "@/lib/news";

const NewsPage = async () => {
  const news = getAllNews();

  return <NewsList list={news} />;
};

export default NewsPage;
