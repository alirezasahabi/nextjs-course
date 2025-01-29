import Link from "next/link";
import { getAvailableNewsYears } from "@/lib/news";

const ArchivePage = () => {
  const years = getAvailableNewsYears();

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
};

export default ArchivePage;
