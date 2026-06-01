"use client";

import { useFormStatus } from "react-dom";

const FormSubmit = () => {
  const { pending } = useFormStatus();

  return (
    <p className="form-actions">
      {pending ? (
        "Creating post..."
      ) : (
        <>
          <button type="reset">Reset</button>
          <button>Create Post</button>
        </>
      )}
    </p>
  );
};

export default FormSubmit;
