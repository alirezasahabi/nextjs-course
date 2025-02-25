import NewsList from "@/components/news-list";

/**
 * Client-Side vs Server-Side data fetching
 *
 * In client-side data fetching, if we inspect the "News" page source code,
 * we won't see the actual news content there.
 * Becuase the content that's generated on the server, doesn't include those news
 * because we fetch them on the client-side.
 * NextJS offers better ways of fetching data.
 * React server components can return promises instead of just JSX.
 * Fetching data directly inside of server components
 * is the standard approach we should use in NextJS.
 */

const NewsPage = async () => {
  /**
   * We are sending the fetch request directly inside component function,
   * since it's such a server component.
   * This "fetch" function is available here, even though that code runs on the server because:
   *  - It's supported by NodeJS(which executes the server side code anyways).
   *  - NextJS extends this "fetch" function & adds some extra caching related features.
   */
  const response = await fetch("http://localhost:8080/news");

  if (!response.ok) throw new Error("Faild to fetch the list of news!");

  /**
   * We don't need to check whether data(here news) are defined or not,
   * because now since we have an async component, we wait until
   * the response data is there anyways. No JSX code gets generated before that data is there.
   * So we won't have a scenario where  where data is undefined(unless the back-end returns).
   */
  const news = await response.json();

  return <NewsList list={news} />;
};

export default NewsPage;
