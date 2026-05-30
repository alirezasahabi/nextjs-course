import sql from "better-sqlite3";

// We pass a path to our DB file that's relative to the root project folder.
const db = sql("data.db");

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  image: string;
  date: string;
  content: string;
}

export async function getAllNews() {
  // better-sqlite3 gives a synchronous API
  const news = db.prepare("SELECT * FROM news").all() as NewsItem[];

  // Simulating loading
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return news;
}

export async function getNewsItem(slug: string) {
  const newsItem = db
    .prepare("SELECT * FROM news WHERE slug = ?")
    .get(slug) as NewsItem;

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return newsItem;
}

export async function getLatestNews() {
  const latestNews = db
    .prepare("SELECT * FROM news ORDER BY date DESC LIMIT 3")
    .all() as NewsItem[];
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return latestNews;
}

export async function getAvailableNewsYears() {
  const years = (
    db
      .prepare("SELECT DISTINCT strftime('%Y', date) as year FROM news")
      .all() as any[]
  ).map((year) => year.year) as string[];

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return years;
}

export function getAvailableNewsMonths(year: string) {
  return (
    db
      .prepare(
        "SELECT DISTINCT strftime('%m', date) as month FROM news WHERE strftime('%Y', date) = ?",
      )
      .all(year) as any[]
  ).map((month) => month.month) as string[];
}

export async function getNewsForYear(year: string) {
  const news = db
    .prepare(
      "SELECT * FROM news WHERE strftime('%Y', date) = ? ORDER BY date DESC",
    )
    .all(year) as NewsItem[];

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return news;
}

export async function getNewsForYearAndMonth(year: string, month: string) {
  const news = db
    .prepare(
      "SELECT * FROM news WHERE strftime('%Y', date) = ? AND strftime('%m', date) = ? ORDER BY date DESC",
    )
    .all(year, month) as NewsItem[];

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return news;
}
