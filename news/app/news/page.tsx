import Link from "next/link";

const NewsPage = () => {
  const news = ["News #1", "News #2", "News #3"];

  return (
    <ul>
      {news.map((n, i) => (
        <li key={i}>
          <Link href={`/news/${i + 1}`}>{n}</Link>
        </li>
      ))}
    </ul>
  );
};

export default NewsPage;
