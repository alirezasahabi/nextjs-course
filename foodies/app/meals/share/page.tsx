import ImagePicker from "@/components/meals/image-picker";
import classes from "./page.module.css";

export default function ShareMealPage() {
  /**
  * When it comes to handling form submissions we could do it
  * as we do it in most React projects. Pass a function to onSubmit prop,
  * manually collect all the data & send it to a back-end.
  *
  * But here we already are on the back-end.
  * NextJS provides a more powerful & convenient pattern.
  * We create a function in the component that holds the form.
  * We add the "use server" directive inside the body of this function.
  * This creates a "Server Action", which is a function that executes on the server.
  * In addition we also have to add the "async" keyword to this function too.
   
  * (This feature exists on React just like server components which needs to be unlocked
  * by a framework like NextJS).
  
  * We assign this server action as a value for the "action" prop of the form.
  
  * (Normally the "action prop is set to the path to which the request should be sent
  * if we're relying on the browser built-in form handling capabilities.")
  
  * This will insure that when this form is submitted NextJS will behind the scenes,
  * create a request & send it to this NextJS server that's serving the website, 
  * so that this function gets triggered & we can handle the form submission there.
  * This function will automatically receive the "formData" that was submitted. 
  */

  async function shareMeal(formData: FormData) {
    "use server";

    const meal = {
      title: formData.get("title"),
      summary: formData.get("summary"),
      instructions: formData.get("instructions"),
      image: formData.get("image"),
      creator: formData.get("name"),
      creator_email: formData.get("email"),
    };

    /**
     * If we submit the form we see that:
     * the page didn't reload,
     * we see no log in the console & instead we see the output
     * on the server side in that terminal where we started the development server.
     */
    console.log(meal);
  }

  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={classes.main}>
        <form className={classes.form} action={shareMeal}>
          <div className={classes.row}>
            <p>
              <label htmlFor="name">Your name</label>
              <input type="text" id="name" name="name" required />
            </p>
            <p>
              <label htmlFor="email">Your email</label>
              <input type="email" id="email" name="email" required />
            </p>
          </div>
          <p>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" required />
          </p>
          <p>
            <label htmlFor="summary">Short Summary</label>
            <input type="text" id="summary" name="summary" required />
          </p>
          <p>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              rows={10}
              required
            ></textarea>
          </p>
          <ImagePicker label="Your Image" name="image" />
          <p className={classes.actions}>
            <button type="submit">Share Meal</button>
          </p>
        </form>
      </main>
    </>
  );
}
