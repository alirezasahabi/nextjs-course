import Link from "next/link";
import NewsList from "@/components/news-list";
import {
  getAvailableNewsMonths,
  getAvailableNewsYears,
  getNewsForYear,
  getNewsForYearAndMonth,
} from "@/lib/news";
import { News } from "@/dummy-news";

interface Props {
  params: Promise<{ filter?: string[] }>;
}
const FilteredNewsPage = async ({ params }: Props) => {
  const filter = (await params).filter;
  const selectedYear = filter?.[0];
  const selectedMonth = filter?.[1];

  let links = getAvailableNewsYears();
  let newsList: News[] = [];

  if (selectedYear && !selectedMonth) {
    links = getAvailableNewsMonths(selectedYear);
    newsList = getNewsForYear(selectedYear);
  }

  if (selectedYear && selectedMonth) {
    links = [];
    newsList = getNewsForYearAndMonth(selectedYear, selectedMonth);
  }

  let newsContent = <p>Not news found for the selected period!</p>;

  if (newsList.length > 0) newsContent = <NewsList list={newsList} />;

  if (
    (selectedYear && !getAvailableNewsYears().includes(+selectedYear)) ||
    (selectedMonth &&
      !getAvailableNewsMonths(selectedYear ?? "").includes(+selectedMonth))
  )
    throw new Error("Invalid filter!");

  return (
    <>
      <header id="archive-header">
        <nav>
          <ul>
            {links.map((link) => {
              const href = selectedYear
                ? `/archive/${selectedYear}/${link}`
                : `/archive/${link}`;

              return (
                <li key={link}>
                  <Link href={href}>{link}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      {newsContent}
    </>
  );
};

export default FilteredNewsPage;
