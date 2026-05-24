"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

const isInvalidText = (text: any) => !text || text.trim() === "";

export async function shareMeal(
  _: { message: string | null },
  formData: FormData,
) {
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    /**
     * When we add a new meal in the production the uploaded image gets lost.
     * Right now we're storing images in the "public" folder.
     * The problem with this approach is that the "public" folder is available during development
     * but for production it's coppied into ".next" folder & it's this folder that will be used
     * by the running NextJS production server.
     * So if we then add a new image to the "public", it will be ignored.
     *
     * This behavior is described in the NextJS docs: https://nextjs.org/docs/pages/building-your-application/optimizing/static-assets
     * NextJS recommend that we should store any files that are generated at runtime,
     * using extra file storage services(EX: AWS S3).
     */
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  /**Server-side validation */
  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !(meal.creator_email as string).includes("@") ||
    !meal.image ||
    (meal.image as File).size === 0
  )
    return { message: "Invalid input!" };

  await saveMeal(meal as any);

  revalidatePath("/meals");

  redirect("/meals");
}
