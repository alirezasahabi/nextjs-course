import NewsList from "@/components/news-list";

const NewsPage = async () => {
  const response = await fetch("http://localhost:8080/news");

  if (!response.ok) throw new Error("Faild to fetch the list of news!");

  const news = await response.json();

  return <NewsList list={news} />;
};

export default NewsPage;
