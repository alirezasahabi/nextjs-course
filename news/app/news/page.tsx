import Link from "next/link";
import { DUMMY_NEWS } from "@/dummy-news";

const NewsPage = () => {
  return (
    <ul className="news-list">
      {DUMMY_NEWS.map((news) => (
        <li key={news.id}>
          <Link href={`/news/${news.id}`}>
            <img src={`/images/news/${news.image}`} alt={news.title} />
            <span>{news.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NewsPage;
