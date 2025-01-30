/**
 * Catch-All Routes
 * Sometimes we need varying number of parameters in a route.
 * Ex: list of archived news => /archive/2024/03/...
 * To implement this, we don't need to create so many nested folders.
 * We create a folder called 'archive'.
 * Inside that, we create another folder & name it like this: [...slug].
 * NOTE: We name this folder 'slug' because it can contains a url slug,
 * but we can name it anything.
 * To make this accept varying number of parameters we should prefix it with '...'.
 *
 * With this implementation we should pass at least 1 parameter.
 * So if we remove all parameters & go to '/archive', we get 404.
 * To fix this & make the slug paramater optional,
 * we have to wrap it in double square brackets: [[...slug]].
 * 
 * NOTE: With the current implementation we'll get an error:
 *       You cannot define a route with the same specificity as a optional catch-all route ("/archive" and "/archive[[...filter]]").
 *       This means that we have t2o conflicting "page" files.
 *       "[[...filter]]" will catch all the segments after "/archive".
 *       But we have two "page" file: archive/page _ archive/[[...filter]]/page
 *       To fix this we should remove the "page" file in the archive folder.
 *       
 */

import Link from "next/link";
import { getAvailableNewsYears } from "@/lib/news";

interface Props {
  params: Promise<{ filter?: string[] }>;
}
const FilteredNewsPage = async ({ params }: Props) => {
  const years = getAvailableNewsYears();

  const filter = (await params).filter;

  console.log(filter);

  return (
    <header id="archive-header">
      <nav>
        <ul>
          {years.map((year) => (
            <li key={year}>
              <Link href={`/archive/${year}`}>{year}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );

  // const filteredNews = getNewsForYear(year);

  // return <NewsList list={filteredNews} />;
};

export default FilteredNewsPage;
