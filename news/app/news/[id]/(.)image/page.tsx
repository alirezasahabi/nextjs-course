/**
* Intercepting Route
*
* It's an alternative route, which sometimes gets activated depending on
* whether we're navigating to it through an internal link from within the page(SPA mode)
* or we're coming from an external link / manually enter the URL / reload the page.
* So for the same path, different pages are shown depending on how we got there.
* It intercepts an internal navigation request & instead of showing the page we would see,
* if we reload the page / come from the page outside of the website, a different page will be shown.
*
* To set up an intercepting route, we create a sibling folder to the page that we want to intercept
* & name it like this:
* (The path from this folder to the segment that should be intercepted(similar to import path))
*  +
* Name of the path of the route we want to intercept
* EX: (.)image
* NOTE: We pass "." if it's in the same folder(similar to import path).
*
* More info => https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes
* 
* This is especially a useful feature when combined with "Parallel Routes" to
* for example to show the content in a modal if it's intercepted or 
* as fullscreen page if we came there by reloading or entering the link manually.
*/

import { DUMMY_NEWS } from "@/dummy-news";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}
const InterceptedImagePage = async ({ params }: Props) => {
  const id = (await params).id;

  const news = DUMMY_NEWS.find((news) => news.id === id);

  if (!news) notFound();

  return (
    <>
      <h2>Intercepted!</h2>
      <div className="fullscreen-image">
        <img src={`/images/news/${news?.image}`} alt={news?.title} />
      </div>
    </>
  );
};

export default InterceptedImagePage;
