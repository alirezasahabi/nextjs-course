import sql from "better-sqlite3";

/**Establish the database connection by passing the name of the database */
const db = sql("meals.db");

export interface Meal {
  id: number;
  slug: string;
  title: string;
  image: string;
  summary: string;
  instructions: string;
  creator: string;
  creator_email: string;
}

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  /**Pass SQL statement */
  return db.prepare("SELECT * FROM meals").all();
  /**Fetch all the rows */
  // .all
  /**Fetch single row */
  // .get
  /**For changing data */
  // .run
}
