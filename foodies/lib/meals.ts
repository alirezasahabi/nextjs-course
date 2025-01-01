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

  // throw new Error("Hoy!");

  /**Pass SQL statement */
  return db.prepare("SELECT * FROM meals").all();
  /**Fetch all the rows */
  // .all
  /**Fetch single row */
  // .get
  /**For changing data */
  // .run
}

export function getMeal(id: number) {
  /**
   * We use a "?" as placeholder, call the get method & pass the value that should be inserted
   * for that placeholder.
   * Under the hood "better-sqlite3" will protect us agains SQL injection attacks.
   * That's why we should add dynamic values into our statements like this.
   */
  return db.prepare(`SELECT * FROM meals WHERE id = ?`).get(id);
  /**This will be insecure. Becuse it opens ourself up to SQL injextion. */
  // db.prepare(`SELECT * FROM meals WHERE id = ${id}`);
}
