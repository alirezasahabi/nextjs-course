/**
 * We can also store server actions inside a separate file.
 * We add the "use server" directive add the top of the file.
 * By adding this all the functions that we define in this file
 * will be treated as server actions.
 */

"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";

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
    return { message: "Invalid input!"  };
  }

  await saveMeal(meal as any);
  redirect("/meals");
}
