"use client";

import { useFormStatus } from "react-dom";

const MealFormSubmit = () => {
  /**
   * A hook provided by React that only works when using NextJS.
   * This gives us a status object of a form, only if it's inside of that form.
   * (It has to come up as a child of that form or have form wrapper.)
   * This status object has a various properties.
   * "pending": Returns true if there is an ongoing request & false otherwise.
   */
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Share Meal"}
    </button>
  );
};

export default MealFormSubmit;
