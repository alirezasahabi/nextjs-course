import NewsList from "@/components/news-list";
import { getNewsForYear } from "@/lib/news";

interface Props {
  params: Promise<{ year: string }>;
}
const FilteredNewsPage = async ({ params }: Props) => {
  const year = (await params).year;

  const filteredNews = getNewsForYear(year);

  return <NewsList list={filteredNews} />;
};

export default FilteredNewsPage;
