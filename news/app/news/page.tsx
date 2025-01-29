import NewsList from "@/components/news-list";
import { DUMMY_NEWS } from "@/dummy-news";

const NewsPage = () => {
  return <NewsList list={DUMMY_NEWS} />;
};

export default NewsPage;
