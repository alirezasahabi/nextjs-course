"use client";

import { useEffect, useState } from "react";
import NewsList from "@/components/news-list";
import { News } from "@/dummy-news";

const NewsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    async function fetchNews() {
      setIsLoading(true);

      const response = await fetch("http://localhost:8080/news");

      if (!response.ok) {
        setError("Failded to fetch news list!");
        setIsLoading(false);
      }

      const data = await response.json();
      setNews(data);

      setIsLoading(false);
    }

    fetchNews();
  }, []);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  return <NewsList list={news} />;
};

export default NewsPage;
