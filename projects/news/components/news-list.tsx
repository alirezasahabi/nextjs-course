import { NewsItem } from "@/lib/news";
import Link from "next/link";

interface Props {
  list: NewsItem[];
}
const NewsList = ({ list }: Props) => {
  return (
    <ul className="news-list">
      {list.map((news) => (
        <li key={news.id}>
          <Link href={`/news/${news.slug}`}>
            <img src={`/images/news/${news.image}`} alt={news.title} />
            <span>{news.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NewsList;
