# Server Actions

> Server-side functions for handling form submissions, data mutations, and cache revalidation.

---

## Table of Contents

- [Introduction](#introduction)
- [Defining a Server Action](#defining-a-server-action)
    - [Inline — inside a Server Component](#inline--inside-a-server-component)
    - [Separate file — works everywhere](#separate-file--works-everywhere)
- [Handling the Form Response](#handling-the-form-response)
    - [useFormStatus](#useformstatus)
    - [useActionState](#useactionstate)
- [Cache Revalidation](#cache-revalidation)
    - [revalidatePath](#revalidatepath)

---

## Introduction

In a standard React app, form submissions are handled by attaching an `onSubmit` handler, manually collecting field values, and sending a `fetch` request to a separate back-end API.

In Next.js, **you are already on the back-end.** Server Actions are async functions marked with the `"use server"` directive that execute directly on the server when a form is submitted. Next.js handles the request/response cycle behind the scenes — no manual `fetch`, no separate API route needed.

When a form with a Server Action is submitted:

- The page does **not** reload.
- No output appears in the browser console — logs show up in your **terminal** (server-side).
- The `formData` submitted by the form is automatically passed to the action function.

---

## Defining a Server Action

There are two ways to define a Server Action, and each has a different scope.

### Inline — inside a Server Component

You can define a Server Action directly inside the component that holds the form, by placing `"use server"` at the top of the function body. The function must also be `async`.

```tsx
// app/meals/share/page.tsx

export default function ShareMealPage() {
  async function shareMeal(formData: FormData) {
    "use server"; // marks this function as a Server Action

    const title = formData.get("title") as string;
    const summary = formData.get("summary") as string;

    console.log("Received meal:", { title, summary });
    // ✅ This log appears in the terminal, not the browser console
    // Safe to call the database directly here
  }

  return (
    <form action={shareMeal}>
      <input type="text" name="title" placeholder="Title" required />
      <input type="text" name="summary" placeholder="Summary" required />
      <button type="submit">Share</button>
    </form>
  );
}
```

> **Limitation:** This approach only works if the component is a **Server Component**. If you add `"use client"` to the component, the inline Server Action will throw an error.

---

### Separate file — works everywhere

The recommended approach for most apps is to move Server Actions into a dedicated file and add `"use server"` at the **top of the file**. Every function exported from that file is automatically treated as a Server Action.

This approach has one major advantage: **Server Actions defined in a separate file can be imported and used inside Client Components too.**

```ts
// lib/actions.ts
"use server"; // all exported functions in this file are Server Actions

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { saveMeal, type MealData } from "@/lib/meals";

export async function shareMeal(formData: FormData) {
  const meal: MealData = {
    title: formData.get("title") as string,
    summary: formData.get("summary") as string,
    instructions: formData.get("instructions") as string,
    image: formData.get("image") as File,
    creatorName: formData.get("name") as string,
    creatorEmail: formData.get("email") as string,
  };

  await saveMeal(meal);
  revalidatePath("/meals");
  redirect("/meals");
}
```

```tsx
// app/meals/share/page.tsx — Server Component using the imported action
import { shareMeal } from "@/lib/actions";

export default function ShareMealPage() {
  return (
    <form action={shareMeal}>
      <input type="text" name="title" required />
      <button type="submit">Share</button>
    </form>
  );
}
```

```tsx
// components/some-client-component.tsx — Client Component using the same action
"use client";

import { shareMeal } from "@/lib/actions";

export default function SomeClientComponent() {
  return (
    <form action={shareMeal}>
      <input type="text" name="title" required />
      <button type="submit">Share</button>
    </form>
  );
}
```

---

## Handling the Form Response

### `useFormStatus`

`useFormStatus` is a hook from `react-dom` that gives you the submission status of the nearest parent `<form>`. It **must** be used inside a component that is rendered as a child of that form — it won't work if called directly in the same component that holds the `<form>`.

The most common use case is disabling the submit button and showing a loading label while the action is pending.

```tsx
// components/meals/meal-form-submit.tsx
"use client"; // must be a Client Component — it uses a hook

import { useFormStatus } from "react-dom";

const MealFormSubmit = () => {
  const { pending } = useFormStatus();
  // pending = true while the Server Action is executing
  // pending = false once it resolves

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Share Meal"}
    </button>
  );
};

export default MealFormSubmit;
```

```tsx
// app/meals/share/page.tsx — MealFormSubmit is a child of the form, so useFormStatus works
import MealFormSubmit from "@/components/meals/meal-form-submit";
import { shareMeal } from "@/lib/actions";

export default function ShareMealPage() {
  return (
    <form action={shareMeal}>
      <input type="text" name="title" required />
      {/* ✅ Inside the form → useFormStatus has access to the form's status */}
      <MealFormSubmit />
    </form>
  );
}
```

> **Why a separate component?** `useFormStatus` reads the status of its **parent** form. If you call it directly in the component that renders `<form>`, it won't find a parent form — it has to be in a child component nested inside the form.

**`useFormStatus` properties:**

| Property  | Type               | Description                                                 |
| --------- | ------------------ | ----------------------------------------------------------- |
| `pending` | `boolean`          | `true` while the form is being submitted, `false` otherwise |
| `data`    | `FormData \| null` | The data being submitted                                    |
| `method`  | `string`           | The HTTP method (`get` or `post`)                           |
| `action`  | `function \| null` | Reference to the action function passed to the form         |

---

### `useActionState`

`useActionState` (from `react`) manages the **response state** returned by a Server Action — for example, showing validation errors or success messages without a page reload.

Think of it as `useState` that is wired to a Server Action: the state updates automatically whenever the action returns a value.

**Signature:**

```ts
const [state, formAction, isPending] = useActionState(action, initialState);
```

| Parameter / Return | Description                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| `action`           | The Server Action to call on submit                                                                      |
| `initialState`     | The initial state value before any submission                                                            |
| `state`            | The current state — starts as `initialState`, updates to the action's return value after each submission |
| `formAction`       | Pass this to the form's `action` prop instead of the raw Server Action                                   |
| `isPending`        | `true` while the action is running (same as `useFormStatus`'s `pending`)                                 |

**Important:** When an action is passed to `useActionState`, Next.js calls it with **two arguments** instead of one:

1. `prevState` — the previous state (or `initialState` on the first call)
2. `formData` — the submitted form data

Your Server Action must accept both:

```ts
// lib/actions.ts
"use server";

import type { Metadata } from "next";

interface ActionState {
  message: string | null;
}

export async function shareMeal(
  prevState: ActionState, // ← added for useActionState
  formData: FormData
): Promise<ActionState> {
  const title = formData.get("title") as string;

  if (!title || title.trim() === "") {
    return { message: "Title is required." }; // returned value becomes the new state
  }

  // ... save to DB ...

  return { message: null }; // null = no error
}
```

```tsx
// app/meals/share/page.tsx
"use client";

import { useActionState } from "react";
import { shareMeal } from "@/lib/actions";
import MealFormSubmit from "@/components/meals/meal-form-submit";
import ImagePicker from "@/components/meals/image-picker";
import classes from "./page.module.css";

interface FormState {
  message: string | null;
}

export default function ShareMealPage() {
  const [state, action, isPending] = useActionState<FormState>(
    shareMeal as any,
    { message: null } // initialState
  );

  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={classes.main}>
        {/* ✅ Pass `action` (from useActionState) — not `shareMeal` directly */}
        <form className={classes.form} action={action}>
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
            <textarea id="instructions" name="instructions" rows={10} required />
          </p>
          <ImagePicker label="Your Image" name="image" />
          {/* Show error/status message returned by the action */}
          {state.message && <p className={classes.error}>{state.message}</p>}
          <p className={classes.actions}>
            <MealFormSubmit />
          </p>
        </form>
      </main>
    </>
  );
}
```

**Data flow summary:**

```
User submits form
      ↓
useActionState intercepts → calls shareMeal(prevState, formData)
      ↓
shareMeal runs on the server → returns { message: "..." } or { message: null }
      ↓
state updates → component re-renders with new state
      ↓
{state.message && <p>...</p>} shows the error or nothing
```

---

## Cache Revalidation

### `revalidatePath`

Next.js aggressively caches pages at build time. When you run `npm run build` | `next build`, Next.js pre-renders every page it can and stores the result. After deployment, it serves those pre-rendered pages instantly — **without re-fetching data**, even if the underlying data changes.

This means if a user adds a new meal via a Server Action, the `/meals` page won't reflect that change until the cache is invalidated.

`revalidatePath` tells Next.js to discard the cached version of a specific route path so it gets re-rendered (and data re-fetched) on the next request.

```ts
import { revalidatePath } from "next/cache";

// Revalidate a single page
revalidatePath("/meals");

// Revalidate a dynamic route
revalidatePath("/meals/123");
```

**Scope — second parameter:**

|Value|Behavior|
|---|---|
|`"page"` (default)|Revalidates only the exact path. Nested routes are unaffected.|
|`"layout"`|Revalidates the layout at that path and **all nested pages** beneath it.|

```ts
// Revalidate only /meals
revalidatePath("/meals", "page");

// Revalidate /meals AND all pages nested under it (/meals/[id], etc.)
revalidatePath("/meals", "layout");

// Nuclear option — revalidate every page in the entire app
revalidatePath("/", "layout");
```

**Typical usage inside a Server Action:**

```ts
// lib/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { saveMeal, type MealData } from "@/lib/meals";

export async function shareMeal(formData: FormData) {
  const meal: MealData = {
    title: formData.get("title") as string,
    summary: formData.get("summary") as string,
    instructions: formData.get("instructions") as string,
    image: formData.get("image") as File,
    creatorName: formData.get("name") as string,
    creatorEmail: formData.get("email") as string,
  };

  await saveMeal(meal);

  // Throw away the cached /meals page so the new meal appears immediately
  revalidatePath("/meals");

  // Send the user to the updated meals list
  redirect("/meals");
}
```

> **Why call `revalidatePath` before `redirect`?** `redirect` throws an internal Next.js error to interrupt execution — so any code after it won't run. Always revalidate first, then redirect.

**`revalidatePath` vs `revalidateTag`:**

For more granular cache control, Next.js also provides `revalidateTag`, which lets you tag individual `fetch` calls and invalidate them by tag rather than by path. Useful when multiple pages share the same underlying data.

```ts
// Tagging a fetch
const data = await fetch("https://api.example.com/meals", {
  next: { tags: ["meals"] },
});

// Invalidating by tag — affects any page that fetched with this tag
revalidateTag("meals");
```