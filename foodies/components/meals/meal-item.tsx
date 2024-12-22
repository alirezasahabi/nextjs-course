import Image from "next/image";
import classes from "./meal-item.module.css";
import Link from "next/link";
import { Meal } from "@/lib/meals";

const MealItem = ({ image, title, creator, summary, slug }: Meal) => {
  return (
    <article className={classes.meal}>
      <header>
        <div className={classes.image}>
          {/**
           * The images outputting here will not be imported from the assets folder.
           * We'll load them dynamically from a database & in there we'll have a path
           * pointing to an image. NextJS will not be able to resolve the width & height
           * of such an image. Because the information is not avilable at build time
           * as it's the case for all imported images, but only at runtime.
           *
           * That's why we add this special "fill" prop.
           * This tells NextJS that it should fill the available space with that image(As defined by its parent component).
           * We can use "fill" props instead of setting a "width" & "height"
           * whenever we have an image where we don't know the dimensions in advantage.
           */}
          <Image src={image} alt={title} fill />
        </div>
        <div className={classes.headerText}>
          <h2>{title}</h2>
          <p>by {creator}</p>
        </div>
      </header>
      <div className={classes.content}>
        <p className={classes.summary}>{summary}</p>
        <div className={classes.actions}>
          <Link href={`/meals/${slug}`}>View Details</Link>
        </div>
      </div>
    </article>
  );
};

export default MealItem;
