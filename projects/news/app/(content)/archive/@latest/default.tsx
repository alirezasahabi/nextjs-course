import NewsList from "@/components/news-list";
import { getLatestNews } from "@/lib/news";

const LatestPage = () => {
  const news = getLatestNews();

  return (
    <>
      <h2>Latest News</h2>
      <NewsList list={news} />
    </>
  );
};

export default LatestPage;
