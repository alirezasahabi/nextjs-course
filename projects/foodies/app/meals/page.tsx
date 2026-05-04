import Link from "next/link";
import classes from "./page.module.css";
import MealsGrid from "@/components/meals/meals-grid";
import { getMeals, Meal } from "@/lib/meals";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Meals",
  description: "Browse the delicious meals!",
};

/**Server component functions can be converted to async functions */
const Meals = async () => {
  /**
   * In vanila React apps, we use the "useEffect" hook to send request to a back-end
   * & then in the back-end we reach out to a database & get the data.
   * In a NextJS app we already have a back-end & also all our components are server components by default(Only execute on the server).
   * Because we have these server components, we don't need "useEffect" &
   * we don't need to send a fetch request to get data, we can directly reach out to the database from here.
   * Because this is a server component that only runs on the server, reaching out to a database is safe here.
   */

  const meals = (await getMeals()) as Meal[];

  return <MealsGrid meals={meals} />;
};

const MealsPage = () => {
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
        {/**
         * We can go to the places where we have operation that may take a bit longer(like data fetching),
         * create a separate component move them there. Now it's this component that is responsible for fetching data.
         * The adventage is that we now outsourced the data fetching part into a separate component & now
         * wrap this component with a component that's built in React "Suspense".
         *
         * "Suspense" is a component that is provided by React that allows us handle loading state &
         * show a fallback content until some data or resource has been loaded.
         * NextJS embraces "Suspense" concept & make sure that whenever we have such a component
         * which performs data fetching & returns a promise, it will trigger "Suspense" to
         * show the fallback until they're done.
         *
         * The "loading" file also doing the same thing behinde scenes.
         * It's wrapping the "page" file content with suspense component & then showing
         * the "loading" file content as a fallback.
         */}
        <Suspense
          fallback={<p className={classes.loading}>Loading meals...</p>}
        >
          <Meals />
        </Suspense>
      </main>
    </>
  );
};

export default MealsPage;
