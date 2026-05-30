import NewsList from "@/components/news-list";
import { getLatestNews } from "@/lib/news";

const LatestPage = async () => {
  const news = await getLatestNews();

  return (
    <>
      <h2>Latest News</h2>
      <NewsList list={news} />
    </>
  );
};

export default LatestPage;
