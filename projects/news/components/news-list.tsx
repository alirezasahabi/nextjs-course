import Link from "next/link";
import { News } from "@/dummy-news";

interface Props {
  list: News[];
}
const NewsList = ({ list }: Props) => {
  return (
    <ul className="news-list">
      {list.map((news) => (
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

export default NewsList;
