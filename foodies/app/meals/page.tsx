import Link from "next/link";
import classes from "./page.module.css";
import MealsGrid from "@/components/meals/meals-grid";
import { getMeals, Meal } from "@/lib/meals";

/**Server component functions can be converted to async functions */
const MealsPage = async () => {
  /**
   * In vanila React apps, we use the "useEffect" hook to send request to a back-end
   * & then in the back-end we reach out to a database & get the data.
   * In a NextJS app we already have a back-end & also all our components are server components by default(Only execute on the server).
   * Because we have these server components, we don't need "useEffect" &
   * we don't need to send a fetch request to get data, we can directly reach out to the database from here.
   * Because this is a server component that only runs on the server, reaching out to a database is safe here.
   */

  const meals = (await getMeals()) as Meal[];

  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious meals, created{" "}
          <span className={classes.highlight}>by YOU</span>
        </h1>
        <p>
          Choose your favorite recipe & cook it yourself. It`&apos;`s easy &
          FUN!
        </p>
        <p className={classes.cta}>
          <Link href="/meals/share">Share Your Favorite Recipe</Link>
        </p>
      </header>
      <main className={classes.main}>
        <MealsGrid meals={meals} />
      </main>
    </>
  );
};

export default MealsPage;
