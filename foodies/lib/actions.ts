/**
 * We can also store server actions inside a separate file.
 * We add the "use server" directive add the top of the file.
 * By adding this all the functions that we define in this file
 * will be treated as server actions.
 */

"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

const isInvalidText = (text: any) => !text || text.trim() === "";

export async function shareMeal(
  _: { message: string | null },
  formData: FormData
) {
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  /**
   * Client-side validation isn't enough because
   * for example user can remove require prop of an input from the DevTools.
   */
  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !(meal.creator_email as string).includes("@") ||
    !meal.image ||
    (meal.image as File).size === 0
  ) {
    // throw new Error("Invalid input!");
    /**
     * In server actions, we can also return values.
     * NOTE: If the value is an object, it has to be a serializable object.
     * Which means, for example it shouldn't include any methods,
     * because those would get lost whilst beind send to client.
     */
    return { message: "Invalid input!" };
  }

  await saveMeal(meal as any);
  /**
   * If we build our app production & then run it, when we create a new data(EX: add meal in this project),
   * we can't see that in the app. Also if we reload the "/meals" it reloads so fast
   * although we add a delay in fetching meals.
   * The reason is that NextJS performs aggresive caching with an extra step when building production.
   * NextJS pre-renders all the pages of the app that can be pre-generated.
   * So all data will be fetched during the build process.
   * By pre-rending these pages, it has those pages availabe tight from the start after being deployed.
   * The downside of this approach is that, it necer refetches data.
   * 
   * To fiX this, we need to tell NextJS to throw away its cache or parts of it whenever we create new data.
   * "revalidatePath" built-in function provided by NextJS which tells it to revalidate the cache that
   * belongs to a certain route path.
   * This fucntion also accepts another parameter which can be "page"(default) or "layout".
   * By default only this path will be revalidated & no nested paths.
   * If we set it to "layout", it's the layout that will be revalidated & therefore
   * all nested pages will be revalidated.
   * 
   * Revalidate all the pages of the website.
   * revalidatePath("/", "layout");
   */ 
  revalidatePath("/meals");
  redirect("/meals");
}
