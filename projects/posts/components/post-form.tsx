"use client";

import { useActionState } from "react";
import FormSubmit from "./form-submit";

type PostFormState = {
  errors?: string[];
};

interface Props {
  createPost: (
    prevState: PostFormState,
    formData: FormData,
  ) => Promise<PostFormState | never>;
}
const PostForm = ({ createPost }: Props) => {
  const [state, formAction] = useActionState<PostFormState, FormData>(
    createPost,
    {},
  );

  return (
    <>
      <h1>Create a new post</h1>
      <form action={formAction}>
        <p className="form-control">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
        </p>
        <p className="form-control">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            id="image"
            name="image"
          />
        </p>
        <p className="form-control">
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" rows={5} />
        </p>
        <FormSubmit />
      </form>

      {state.errors && (
        <ul className="form-errors">
          {state.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export default PostForm;
