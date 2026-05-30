import { getAvailableNewsMonths, getAvailableNewsYears } from "@/lib/news";
import Link from "next/link";

interface Props {
  year?: string;
  month?: string;
}
const FilterHeader = async ({ year, month }: Props) => {
  let years = await getAvailableNewsYears();

  let links = years;

  if (year && !month) links = getAvailableNewsMonths(year);
  else if (year && month) links = [];

  if (
    (year && !years.includes(year)) ||
    (month && !getAvailableNewsMonths(year ?? "").includes(month))
  )
    throw new Error("Invalid filter!");

  return (
    <header id="archive-header">
      <nav>
        <ul>
          {links.map((link) => {
            const href = year ? `/archive/${year}/${link}` : `/archive/${link}`;

            return (
              <li key={link}>
                <Link href={href}>{link}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default FilterHeader;
