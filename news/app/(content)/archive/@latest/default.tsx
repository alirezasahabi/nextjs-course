/**
 * If in one of our parallel route, we have a nested route & then go to that page,
 * If we reload the page containing parallel routes, we see the not found page.
 * This is because we're in a parallel route setup here.
 * We're in a layout that tries to render the content of two different routes
 * on the same page & these routes work independent from each other.
 * Since that nested route is still rendered as other parallel routes,
 * we're gonna have a problem. Because those routes don't support such a nested route.
 * (One of our parallel routes did not find a fitting page for the path that we're trying to visit.)
 * This is something we have to keep in mind when working with parallel routes.
 * We can fix this by adding a file named "default".
 * Now it's this file that allows us to define the default fallback content
 * that should be displayed that route doesn't have a more specific content
 * for the path that's currenly loaded.
 * NOTE: If we have the same fallback content as standard content in the "page" file,
 *       we can removev the "page" file.
 */

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
