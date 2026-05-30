import { Suspense } from "react";
import FilterHeader from "./filter-header";
import FilteredNews from "./filtered-news";

interface Props {
  params: Promise<{ filter?: string[] }>;
}
const FilteredNewsPage = async ({ params }: Props) => {
  const filter = (await params).filter;
  const selectedYear = filter?.[0];
  const selectedMonth = filter?.[1];

  return (
    <>
      {/* Option 1 */}
      <Suspense fallback={<p>Loading filter...</p>}>
        <FilterHeader year={selectedYear} month={selectedMonth} />
      </Suspense>
      {/* Option 2 */}
      <Suspense fallback={<p>Loading news...</p>}>
        {/* <FilterHeader year={selectedYear} month={selectedMonth} /> */}
        <FilteredNews year={selectedYear} month={selectedMonth} />
      </Suspense>
    </>
  );
};

export default FilteredNewsPage;
