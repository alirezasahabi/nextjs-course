/**
 * We can also store server actions inside a separate file.
 * We add the "use server" directive add the top of the file.
 * By adding this all the functions that we define in this file
 * will be treated as server actions.
 */

"use server";

export async function shareMeal(formData: FormData) {
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  console.log(meal);
}
