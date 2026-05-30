import NewsList from "@/components/news-list";
import { getNewsForYear, getNewsForYearAndMonth, NewsItem } from "@/lib/news";

interface Props {
  year?: string;
  month?: string;
}
const FilteredNews = async ({ year, month }: Props) => {
  let newsList: NewsItem[] = [];

  if (year && !month) newsList = await getNewsForYear(year);
  else if (year && month) {
    newsList = await getNewsForYearAndMonth(year, month);
  }

  let newsContent = <p>Not news found for the selected period!</p>;

  if (newsList.length > 0) newsContent = <NewsList list={newsList} />;

  return newsContent;
};

export default FilteredNews;
