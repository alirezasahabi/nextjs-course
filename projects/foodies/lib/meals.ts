import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import fs from "node:fs";

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

export async function saveMeal(
  meal: Omit<Meal, "id" | "image"> & { image: File }
) {
  /** 1. Create a unique slug */
  meal.slug = slugify(meal.title, { lower: true });
  /**
   * 2. Sanitizing content
   * Sanitizing content sent by the user to prevent cross-site scripting attacks.
   * This will remove any harmful content.
   */
  meal.instructions = xss(meal.instructions);

  const extention = meal.image.name.split(".").pop();

  /** 3. Generate a unique file name */
  const filename = `${meal.slug}.${extention}`;

  /**
   * 4. Write image to a file
   * Storing image in the file system
   * The image should be stored in the file system & not in the database.
   * Because storing files in the database it's bad for performance & databases aren't build for that.
   *
   * We can achieve this with the help an API provided by NodeJS: fs(file system API)
   * "createWriteStream" will create a stream that allows us write data to a certain file.
   * It needs a path to the file which we wanna write.
   * It returns an stream object which we can use to write to that path.
   */
  const stream = fs.createWriteStream(`public/images/${filename}`);
  /**Conver image to array buffer. */
  const imageArrayBuffer = await meal.image.arrayBuffer();
  /**
   * The first argument is the thing that we wanna write to the file which must be of type buffer.
   * So we convert array buffer to a regular buffer.
   * The second argument is a function that will be executed once it's done writing.
   */
  stream.write(Buffer.from(imageArrayBuffer), (error) => {
    if (error) throw new Error("Failed to save image!");
  });

  /**
   * meal.image = `/public/images/${filename}`
   * We can remove "public", because:
   * All requests for images will be sent to the "public" folder automatically anyways.
   * The content of the "public" folder will be served as if it were served on the root level of our server anyways.
   */
  meal.image = `/images/${filename}` as any;

  /**
   * 5. Store data in the database
   * We can directly inject values but that approach will be vulnerable to SQL Injection.
   * Instead we should use placeholders that we used in "getMeal" function.
   * (?, ?, ?) or property name appended by "@"
   */
  db.prepare(
    `
    INSERT INTO meals 
    (slug, title, image, summary, instructions, creator, creator_email) 
    VALUES(
      @slug,
      @title,
      @image,
      @summary,
      @instructions,
      @creator,
      @creator_email
    )
  `
  ).run(meal);
}
