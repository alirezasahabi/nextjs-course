# Components

> An overview of Server Components, Client Components, and Next.js built-in components.

---

## Table of Contents

- [Server Components vs Client Components](#server-components-vs-client-components)
    - [Server Components](#server-components)
    - [Client Components](#client-components)
    - [Comparison](#comparison)
    - [Mixing Server and Client Components](#mixing-server-and-client-components)
- [Built-in Components](#built-in-components)
    - [Link](#link)
    - [Image](#image)

---

## Server Components vs Client Components

Next.js understands two component models: **Server Components** and **Client Components**. Understanding when and why to use each is one of the most important concepts in Next.js.

### Server Components

In a standard React app (created with Vite or Create React App), React runs entirely in the browser — all components are client-side. Server Components are a React feature that must be unlocked by a framework with the right build process and structure. Next.js is one such framework, and it makes **every component a Server Component by default**.

Server Components execute **only on the server** and their code is never shipped to the browser. This has two major benefits:

- **Performance** — less JavaScript is sent to the client, reducing bundle size and improving load times.
- **SEO** — web crawlers receive fully-rendered HTML. In a vanilla React app, the page source is essentially an empty `<div id="root">` — all content is injected by JavaScript at runtime. With Server Components, crawlers see the complete page content immediately.

Because Server Components run on the server, they can safely access databases, read environment variables, and perform operations that would be insecure or impossible in the browser.

**Server component functions can be `async`**, which means you can `await` data directly in the component body — no `useEffect`, no client-side fetch needed.

```tsx
// app/meals/page.tsx — fetching data directly in a Server Component

import { getMeals, type Meal } from "@/lib/meals";
import MealsGrid from "@/components/meals/meals-grid";

const Meals = async () => {
  const meals = (await getMeals()) as Meal[];
  // This runs on the server — safe to call the database directly
  return <MealsGrid meals={meals} />;
};

export default Meals;
```

**Server Components cannot:**

- Listen to browser events (`onClick`, `onChange`, `onSubmit`, etc.)
- Access browser APIs (`localStorage`, `sessionStorage`, `window`, etc.)
- Use `useState`, `useReducer`, or `useEffect`
- Use any hook that depends on client-side state

---

#### Using `Suspense` for async Server Components

When a Server Component fetches data, the rest of the page doesn't need to wait for it. You can extract the data-fetching part into its own component and wrap it with React's `<Suspense>` — it will show a fallback until the data is ready.

This is the same thing `loading.tsx` does behind the scenes: it wraps the `page` content in a `<Suspense>` and uses the `loading` file's content as the fallback. Using `<Suspense>` directly gives you more granular control — you can have multiple loading states on a single page.

```tsx
// app/meals/page.tsx — granular Suspense for the data-fetching component only

import { Suspense } from "react";
import { getMeals, type Meal } from "@/lib/meals";
import MealsGrid from "@/components/meals/meals-grid";
import classes from "./page.module.css";
import Link from "next/link";

// Isolated component responsible for fetching & rendering meals
const Meals = async () => {
  const meals = (await getMeals()) as Meal[];
  return <MealsGrid meals={meals} />;
};

// The page itself renders immediately — only <Meals> is suspended
const MealsPage = () => {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious meals, created{" "}
          <span className={classes.highlight}>by YOU</span>
        </h1>
        <p>Choose your favorite recipe and cook it yourself. It&apos;s easy and FUN!</p>
        <p className={classes.cta}>
          <Link href="/meals/share">Share Your Favorite Recipe</Link>
        </p>
      </header>
      <main className={classes.main}>
        {/* Only this section shows a loading state — the header renders instantly */}
        <Suspense fallback={<p className={classes.loading}>Loading meals...</p>}>
          <Meals />
        </Suspense>
      </main>
    </>
  );
};

export default MealsPage;
```

> **Tip:** Prefer wrapping individual data-fetching components in `<Suspense>` over using `loading.tsx` when you want parts of a page to appear instantly while others are still loading.

---

### Client Components

Client Components are the traditional React components you're familiar with from Vite or Create React App projects. They run in the browser and have access to browser APIs, user events, and React hooks.

To make a component a Client Component, add the `"use client"` directive at the very top of the file:

```tsx
"use client";

import { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
};

export default Counter;
```

**Important:** When you mark a component as `"use client"`, all components it imports are also treated as Client Components — even if they don't have `"use client"` themselves. The directive propagates down the import tree.

This is why you should **push `"use client"` as deep into the component tree as possible**. The goal is to keep the majority of your components as Server Components, and only convert the specific, smallest pieces that need browser interactivity.

```
✅ Good — only the interactive button is a Client Component

app/
└── page.tsx               (Server Component — fetches data, renders layout)
    └── MealsGrid.tsx      (Server Component — renders the list)
        └── LikeButton.tsx (Client Component — needs onClick + useState)
```

```
❌ Avoid — the whole page becomes client-side unnecessarily

app/
└── page.tsx               ("use client" here means everything below is also client-side)
    └── MealsGrid.tsx      (becomes Client Component)
        └── LikeButton.tsx (becomes Client Component)
```

---

### Comparison

| Capability                                                                    | Server Component |       Client Component        |
| ----------------------------------------------------------------------------- | :--------------: | :---------------------------: |
| Runs on server                                                                |        ✅         | ❌ (only during SSR/hydration) |
| Runs in browser                                                               |        ❌         |               ✅               |
| `async` / `await` in component body                                           |        ✅         |               ❌               |
| Direct database / filesystem access                                           |        ✅         |               ❌               |
| React hooks (`useEffect`, etc.) or any hook that depends on client-side state |        ❌         |               ✅               |
| Browser event handlers (`onClick`, etc.)                                      |        ❌         |               ✅               |
| Browser APIs (`localStorage`, `window`)                                       |        ❌         |               ✅               |
| SEO-friendly (fully rendered HTML)                                            |        ✅         |               ❌               |
| Smaller client JS bundle                                                      |        ✅         |               ❌               |

---

### Mixing Server and Client Components

In real-world apps you'll use both. The recommended pattern is to default to Server Components and introduce Client Components only where interactivity is needed.

```tsx
// app/meals/[id]/page.tsx — Server Component that passes data to a Client Component

import { getMeal, type Meal } from "@/lib/meals";
import { notFound } from "next/navigation";
import MealActions from "@/components/meals/meal-actions"; // Client Component

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MealDetailPage({ params }: Props) {
  const { id } = await params;
  const meal = getMeal(parseInt(id)) as Meal;

  if (!meal) notFound();

  return (
    <article>
      <h1>{meal.title}</h1>
      <p>{meal.summary}</p>
      {/* Server Component passes data down to a Client Component */}
      <MealActions mealId={meal.id} />
    </article>
  );
}
```

```tsx
// components/meals/meal-actions.tsx — Client Component handles interactivity
"use client";

import { useState } from "react";

interface Props {
  mealId: number;
}

const MealActions = ({ mealId }: Props) => {
  const [saved, setSaved] = useState(false);

  return (
    <button onClick={() => setSaved((s) => !s)}>
      {saved ? "Saved ✓" : "Save Meal"}
    </button>
  );
};

export default MealActions;
```

> **Rule of thumb:** Server Components can import and render Client Components, but Client Components **cannot** import Server Components. You can, however, pass a Server Component to a Client Component as `children` or a prop.

---

## Built-in Components

Next.js ships several built-in components that replace or enhance their standard HTML equivalents. They are imported from `next/*` packages.

| Component                                                                 | Import        | Replaces         | Description                                                              |
| ------------------------------------------------------------------------- | ------------- | ---------------- | ------------------------------------------------------------------------ |
| [`<Link>`](#link)                                                         | `next/link`   | `<a>`            | Client-side navigation without full page reload                          |
| [`<Image>`](#image)                                                       | `next/image`  | `<img>`          | Optimized image with lazy loading, responsive sizing, and modern formats |
| [`<Script>`](https://nextjs.org/docs/app/api-reference/components/script) | `next/script` | `<script>`       | Controls loading strategy for third-party scripts                        |
| [`<Font>`](https://nextjs.org/docs/app/api-reference/components/font)     | `next/font/*` | CSS font imports | Self-hosted fonts with zero layout shift                                 |

---

### `<Link>`

Use `<Link>` instead of `<a>` whenever navigating between pages within your app. It keeps the app in **single-page app mode** — only the changed content is fetched and rendered, the browser never does a full page reload.

```tsx
import Link from "next/link";

// Basic navigation
<Link href="/about">About</Link>

// Dynamic route
<Link href={`/meals/${meal.id}`}>View Meal</Link>

// With styling
<Link href="/meals" className={classes.link}>Browse Meals</Link>
```

**Useful props:**

|Prop|Type|Description|
|---|---|---|
|`href`|`string \| object`|The path to navigate to. Required.|
|`replace`|`boolean`|Replaces the current history entry instead of pushing a new one|
|`prefetch`|`boolean \| null`|Prefetches the linked page in the background. Defaults to `true` in production|
|`scroll`|`boolean`|Whether to scroll to the top of the page after navigation. Defaults to `true`|

```tsx
// Navigate without adding to browser history (useful for auth redirects)
<Link href="/login" replace>Log in</Link>

// Disable prefetching for a specific link
<Link href="/heavy-page" prefetch={false}>Heavy Page</Link>
```

> **`<a>` vs `<Link>`:** Use `<Link>` for internal navigation. Use a plain `<a>` only for external URLs or links that should trigger a full page reload.

---

### `<Image>`

Use `<Image>` instead of `<img>` for any image in your app. It automatically handles:

- **Lazy loading** — images are only loaded when they enter the viewport (`loading="lazy"` by default).
- **Responsive sizing** — generates a `srcset` so the correct image size is served depending on the user's screen and device.
- **Modern formats** — automatically serves images in the best format the browser supports (e.g. WebP), which you can verify in the Network tab of DevTools.
- **Automatic dimensions** — for imported images, Next.js automatically reads the intrinsic `width` and `height` at build time.

```tsx
import Image from "next/image";
```

#### Imported (local) images

```tsx
import Image from "next/image";
import logo from "@/assets/logo.png";

// ✅ Pass the entire imported object as src
// Next.js reads its width, height, and path automatically
<Image src={logo} alt="My App Logo" />

// ❌ Don't access .src manually — you lose the size optimization metadata
<img src={logo.src} alt="My App Logo" />
```

> When you import an image in a Next.js project, the result is an **object** — not a plain URL string. It contains the path, width, height, and other metadata that `<Image>` uses internally. Passing the whole object as `src` lets Next.js use all of that information.

Inspecting the rendered `<img>` in DevTools, you'll see attributes that Next.js adds automatically:

```html
<img
  src="/_next/image?url=...&w=384&q=75"
  srcset="/_next/image?url=...&w=256&q=75 256w, /_next/image?url=...&w=384&q=75 384w"
  width="200"
  height="60"
  loading="lazy"
  decoding="async"
/>
```

#### Remote / dynamic images

When an image URL comes from a database or external source, Next.js cannot know its dimensions at build time. Use the `fill` prop to have the image fill its parent container instead:

```tsx
import Image from "next/image";

// The parent must have position: relative and a defined size
<div style={{ position: "relative", width: "100%", height: "300px" }}>
  <Image
    src={meal.image}  // URL from database
    alt={meal.title}
    fill
    style={{ objectFit: "cover" }}
  />
</div>
```

To allow remote images, add the hostname to `next.config.js`:

```js
// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "your-bucket.s3.amazonaws.com",
      },
    ],
  },
};
```

#### Key props

|Prop|Type|Description|
|---|---|---|
|`src`|`string \| StaticImageData`|Image source — URL string or imported image object. Required.|
|`alt`|`string`|Alt text for accessibility. Required.|
|`width`|`number`|Intrinsic width in pixels. Required if `fill` is not set and image is not imported.|
|`height`|`number`|Intrinsic height in pixels. Required if `fill` is not set and image is not imported.|
|`fill`|`boolean`|Fills the parent container. Use when dimensions are unknown (e.g. dynamic images).|
|`priority`|`boolean`|Marks the image as high priority — disables lazy loading and adds a preload hint. Use for above-the-fold images like hero images or LCP candidates.|
|`quality`|`number`|Compression quality, 1–100. Defaults to `75`.|
|`placeholder`|`"blur" \| "empty"`|Shows a blurred preview while the image loads. Works automatically with imported images.|
|`sizes`|`string`|A media condition string that tells the browser which image size to pick from `srcset`.|

```tsx
// Hero image — above the fold, should load immediately
<Image
  src={heroBanner}
  alt="Hero banner"
  priority  // disables lazy loading, adds <link rel="preload">
/>

// Low-quality placeholder while loading
<Image
  src={photo}
  alt="Team photo"
  placeholder="blur"
/>
```