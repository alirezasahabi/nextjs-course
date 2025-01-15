import Image from "next/image";
import classes from "./page.module.css";
import { getMeal, Meal } from "@/lib/meals";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * For dynamic pages, we can add metadata by exporting an async function called "generateMetadata".
 * It must be named like this because NextJS is looking for functions like this to execute.
 * If it doesn't find an exported variable named "metadata", it's checking whether there is such a function.
 *
 * This function receives the same data that our page component receives as props.
 */
export async function generateMetadata({ params }: Props) {
  const id = (await params).id;
  const meal = getMeal(parseInt(id)) as Meal;

  /**
   * If we enter an invalid param id, we get the error page instead of not found,
   * because the metadata is generated first & accessing data of the fetched object fails.
   * We add this if block to ensure we show the not found.
   */
  if (!meal) notFound();

  return { title: meal.title, description: meal.instructions } as Metadata;
}

const MealDetailsPage = async ({ params }: Props) => {
  const id = (await params).id;
  const meal = getMeal(parseInt(id)) as Meal;

  /**
   * By default we get the "error" page.
   * A better way of handling this is show the "not-found" page.
   * "notFound" is a function provided by NextJS which calling it
   * will stop this component from executing & show the closest "not-found" page.
   */
  if (!meal) notFound();

  meal.instructions = meal.instructions.replace(/\n/g, "<br />");

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image src={meal.image} alt={meal.title} fill />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            {/**Setting up a link that will open the mail program. */}
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
        </div>
        <p className={classes.summary}>{meal.summary}</p>
      </header>
      <main>
        {/**
         * Outputting data(Meal Instructions) as HTML code.
         *
         * dangerouslySetInnerHTML: It's called like this because we open ourself up to
         * cross-site scripting attacks(If we're not validating it).
         */}
        <p
          dangerouslySetInnerHTML={{
            __html: meal.instructions,
          }}
          className={classes.instructions}
        />
      </main>
    </>
  );
};

export default MealDetailsPage;
