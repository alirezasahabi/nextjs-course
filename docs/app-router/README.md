# App Router

> Next.js file-based routing system built on React Server Components.

---

## Table of Contents

- [Introduction](#introduction)
- [How It Works](#how-it-works)
- [Reserved Filenames](#reserved-filenames)
- [Folder Naming Conventions](#folder-naming-conventions)
- [Navigation Utilities](#navigation-utilities)

---

## Introduction

The **App Router** (introduced in Next.js 13) is a file-system based router built on top of React Server Components. It lives inside the `app/` directory and replaces the older `pages/` router.

The core idea is simple: **the folder structure inside `app/` maps directly to URL paths.** Each folder represents a route segment, and special reserved filenames inside those folders define how that segment behaves — whether it renders a page, wraps content in a layout, handles errors, shows loading states, and so on.

Unlike the Pages Router, the App Router treats every component as a **Server Component by default**, meaning they run on the server and never ship their code to the browser unless explicitly marked with `"use client"`.

---

## How It Works

```
app/
├── page.tsx           →  renders at "/"
├── layout.tsx         →  root layout, wraps every page
├── about/
│   └── page.tsx       →  renders at "/about"
└── blog/
    ├── page.tsx        →  renders at "/blog"
    └── [slug]/
        └── page.tsx   →  renders at "/blog/:slug"
```

1. **Folders** define route segments (URL paths).
2. **Reserved files** inside folders define the behavior of that segment.
3. The component name inside any file doesn't matter — Next.js cares only about the filename.

---

## Reserved Filenames

These filenames have special meaning in the App Router. Next.js will treat them differently from regular component files.

> Click on a filename in the table to jump to its full description.

| File                                  | Extension                   | Description                                |
| ------------------------------------- | --------------------------- | ------------------------------------------ |
| [`page`](#page)                       | `.js` `.jsx` `.tsx`         | Renders the UI for a route segment         |
| [`layout`](#layout)                   | `.js` `.jsx` `.tsx`         | Shared UI wrapper around one or more pages |
| [`metadata`](#metadata)               | `.js` `.ts` `.tsx`          | Export name - Generates metadata for pages |
| [`loading`](#loading)                 | `.js` `.jsx` `.tsx`         | Suspense-based loading UI for a segment    |
| [`error`](#error)                     | `.js` `.jsx` `.tsx`         | Error boundary UI for a segment            |
| [`not-found`](#not-found)             | `.js` `.jsx` `.tsx`         | UI rendered when `notFound()` is thrown    |
| [`template`](#template)               | `.js` `.jsx` `.tsx`         | Like layout, but re-mounts on navigation   |
| [`default`](#default)                 | `.js` `.jsx` `.tsx`         | Fallback UI for parallel routes            |
| [`route`](#route)                     | `.js` `.ts`                 | API endpoint (server-side route handler)   |
| [`middleware`](#middleware)           | `.js` `.ts`                 | Runs before a request is completed         |
| [`icon`](#icon)                       | `.ico` `.jpg` `.png` `.svg` | Favicon for the app                        |
| [`opengraph-image`](#opengraph-image) | `.jpg` `.png` `.gif`        | Open Graph image for social sharing        |
| [`sitemap`](#sitemap)                 | `.js` `.ts` `.xml`          | Generates a sitemap                        |
| [`robots`](#robots)                   | `.js` `.ts` `.txt`          | Generates a `robots.txt` file              |

---

### `page`

The `page` file tells Next.js to render a page for that route. It must export a **default React component**. The component name doesn't matter — only the filename does.

Every page is a **Server Component** by default, meaning it executes on the server. You can verify this by adding a `console.log` — you'll see the output in your terminal (server logs), not in the browser console.

```tsx
// app/page.tsx  →  renders at "/"

export default function HomePage() {
  console.log("Hoy!"); // ✅ appears in terminal, not in browser console

  return <h1>Welcome to my app</h1>;
}
```

```tsx
// app/about/page.tsx  →  renders at "/about"

export default function AboutPage() {
  return <h1>About Us</h1>;
}
```

> **Note:** To make a component a Client Component (runs in the browser), add `"use client"` at the top of the file.

---

### `layout`

A `layout` wraps one or more pages and defines the **persistent shell** around them — things like navbars, sidebars, and footers that shouldn't re-render on every navigation.

Every Next.js project **must have a root layout** at `app/layout.tsx`. This root layout:

- Must include `<html>` and `<body>` tags (sets up the HTML skeleton).
- Is **always active**, regardless of which page is visited.
- Can export a `metadata` object to set default `<head>` metadata for all pages it covers.

Nested layouts (e.g. `app/dashboard/layout.tsx`) become active only for routes inside that folder, but are themselves wrapped by the root layout.

```tsx
// app/layout.tsx  →  root layout, always active

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My App",
  description: "Welcome to my Next.js app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// app/dashboard/layout.tsx  →  active for all /dashboard/* routes

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>Dashboard Nav</nav>
      <main>{children}</main>
    </div>
  );
}
```

> **`children`** is the content of the currently active page (or nested layout) that this layout wraps.

---

### Metadata

A reserved export name. Exporting it from a layout or page sets `<title>`, `<meta>` tags, etc. automatically — no `<head>` tag needed.

For **static pages**, metadata is set by exporting a `metadata` constant (see [`layout`](#layout)). For **dynamic pages** where the metadata depends on route params or fetched data, export an async function named `generateMetadata` instead.

Next.js looks for this specific function name — if there's no exported `metadata` constant, it checks for `generateMetadata` and calls it automatically. The function receives the **same props as the page component** (e.g. `params`, `searchParams`).

```tsx
// app/meals/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMeal, type Meal } from "@/lib/meals";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const meal = getMeal(parseInt(id)) as Meal;

  /**
   * If an invalid ID is provided, the metadata function runs first (before the page),
   * and accessing properties of a null object would throw an error — showing the error
   * page rather than the not-found page. Calling notFound() here fixes that.
   */
  if (!meal) notFound();

  return {
    title: meal.title,
    description: meal.instructions,
  };
}

export default async function MealPage({ params }: Props) {
  const id = (await params).id;
  const meal = getMeal(parseInt(id)) as Meal;

  if (!meal) notFound();

  return <h1>{meal.title}</h1>;
}
```

> **Why `notFound()` inside `generateMetadata`?** Next.js executes `generateMetadata` **before** rendering the page component. If the ID is invalid and you only guard inside the page, the metadata function will try to read properties off `null` first — throwing an unhandled error and triggering `error.tsx` instead of `not-found.tsx`. Adding the `notFound()` guard in `generateMetadata` ensures the correct fallback is shown.

---

### `loading`

A `loading` file creates an automatic [Suspense](https://react.dev/reference/react/Suspense) boundary for a route segment. It is shown instantly while the page's data is being fetched, giving users immediate feedback.

```tsx
// app/blog/loading.tsx

export default function Loading() {
  return <p>Loading posts...</p>;
}
```

---

### `error`

The `error` file handles potential errors generated by pages and components in the same folder — for example, when a data fetch fails. Whenever an error occurs, Next.js will automatically render this component as a fallback instead of crashing the page.

**Scope:** An `error.tsx` only catches errors from the `page` in the same folder and any nested pages or layouts beneath it. You can add an `error.tsx` at the root of `app/` to catch any error thrown anywhere in your app. You can be as granular as needed — a top-level catch-all alongside more specific ones per route.

**Must be a Client Component** (`"use client"`): error boundaries work by catching errors during rendering, which can happen both on the server (initial render) and on the client (after hydration). Marking it as a Client Component ensures it handles both cases.

**Props passed automatically by Next.js:**

- `error` — the `Error` object that was thrown. The actual error message is intentionally hidden by Next.js in production so you don't accidentally expose sensitive details to users.
- `reset` — a function you can call to re-attempt rendering the failed segment.

```tsx
// app/blog/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }; // digest is a hashed error ID for server logs
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      {/* Don't render error.message in production — Next.js hides the real message anyway */}
      <p>An unexpected error occurred. Please try again.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

```
app/
├── error.tsx              →  catches any error in the entire app (catch-all)
├── blog/
│   ├── error.tsx          →  catches errors only in /blog and its nested routes
│   └── [slug]/
│       └── page.tsx
└── dashboard/
    └── page.tsx            →  errors here bubble up to app/error.tsx
```

> **Note:** `error.tsx` does **not** catch errors thrown inside a `layout.tsx` in the same folder, because the error boundary is rendered _inside_ the layout. To catch layout errors, place an `error.tsx` in the **parent** folder instead.

---

### `not-found`

Rendered when the `notFound()` function is called from within a route segment, or when no route matches the URL. Scoped to the nearest parent layout.

```tsx
// app/blog/[slug]/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Post Not Found</h2>
      <p>The blog post you're looking for doesn't exist.</p>
    </div>
  );
}
```

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) notFound(); // triggers not-found.tsx

  return <article>{post.content}</article>;
}
```

---

### `template`

Similar to `layout`, but **re-mounts on every navigation** — meaning state is not preserved between navigations. Useful when you need enter/exit animations or need to re-run `useEffect` on navigation.

```tsx
// app/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="fade-in">{children}</div>;
}
```

---

### `default`

A fallback UI used with [Parallel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes) (`@slot` folders). Rendered when Next.js cannot determine a slot's active state.

```tsx
// app/@modal/default.tsx
export default function Default() {
  return null; // render nothing by default
}
```

---

### `route`

Creates a **server-side HTTP endpoint** (Route Handler) — the App Router equivalent of an API route. The folder path becomes the URL. Export functions named after HTTP methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`.

> **Note:** A folder can have either a `page.tsx` **or** a `route.ts` — not both. `page` renders UI, `route` handles HTTP requests.

```
app/
└── api/                   ← common convention, any folder name works
    ├── meals/
    │   └── route.ts       →  GET /api/meals, POST /api/meals
    └── meals/[id]/
        └── route.ts       →  GET /api/meals/[id], DELETE /api/meals/[id]
```


```ts
// app/api/meals/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const meals = await getMeals();
  return NextResponse.json(meals);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newMeal = await createMeal(body);
  return NextResponse.json(newMeal, { status: 201 });
}
```


```ts
// app/api/meals/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const meal = await getMeal(parseInt(params.id));
  if (!meal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(meal);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await deleteMeal(parseInt(params.id));
  return new NextResponse(null, { status: 204 });
}
```

> **Route Handler vs Server Action:** Use Server Actions for form submissions and mutations from your own UI. Use Route Handlers when you need a real HTTP endpoint — for a mobile app, a webhook, or a public API.
---

### `middleware`

Runs **before every request is processed** — before the page renders, before route handlers execute, before caching is checked. The right place for auth checks, redirects, and header manipulation.

Lives in the **project root** (next to `app/`, not inside it). Must export a function named `middleware`.


```ts
// middleware.ts  (project root)
import { NextResponse } from "next/server";
import type { NextRequest, MiddlewareConfig } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
```

**`NextResponse` methods:**

|Method|Description|
|---|---|
|`NextResponse.next()`|Forwards the request to its actual destination|
|`NextResponse.redirect(url)`|Redirects the user to another URL|
|`NextResponse.rewrite(url)`|Serves from a different URL without changing the browser URL|
|`new NextResponse(body, options)`|Constructs a response from scratch|

**Filtering with `config.matcher`** — by default middleware runs on every request. Export a `config` object to restrict it:


```ts
// Single path
export const config: MiddlewareConfig = {
  matcher: "/news",
};

// Multiple paths and patterns
export const config: MiddlewareConfig = {
  matcher: [
    "/dashboard/:path*",  // /dashboard and all nested routes
    "/api/:path*",        // all API routes
  ],
};
```

> For the full list of matcher options, see the [Next.js Middleware docs](https://nextjs.org/docs/app/building-your-application/routing/middleware).

---

### `icon`

Place an image named `icon` in the `app/` folder and Next.js will automatically use it as the **favicon**. Supported formats: `.ico`, `.jpg`, `.png`, `.svg`.

```
app/
└── icon.png   →  automatically used as <link rel="icon">
```

You can also export a dynamic icon using `ImageResponse`:

```tsx
// app/icon.tsx
import { ImageResponse } from "next/og";

export default function Icon() {
  return new ImageResponse(<div style={{ fontSize: 24 }}>🚀</div>, {
    width: 32,
    height: 32,
  });
}
```

---

### `opengraph-image`

Place an image named `opengraph-image` in a route folder to set the **Open Graph image** for that route (used when sharing links on social media).

```
app/
└── opengraph-image.png        →  OG image for "/"
app/blog/
└── opengraph-image.png        →  OG image for "/blog"
```

---

### `sitemap`

Generates a `sitemap.xml` file for SEO. Can be a static `.xml` file or a dynamic `.ts` file.

```ts
// app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://myapp.com", lastModified: new Date() },
    { url: "https://myapp.com/about", lastModified: new Date() },
  ];
}
```

---

### `robots`

Generates a `robots.txt` file to control search engine crawling.

```ts
// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/dashboard/" },
    sitemap: "https://myapp.com/sitemap.xml",
  };
}
```

---

## Folder Naming Conventions

Folders inside `app/` define route segments. Beyond naming them after the URL segment you want, Next.js supports several special folder-naming patterns for advanced routing behavior.

| Folder Pattern                               | Route Name               | Example                 | Description                                              |
| -------------------------------------------- | ------------------------ | ----------------------- | -------------------------------------------------------- |
| [`folder`](#regular-route)                   | Regular Route            | `app/about/`            | A plain URL segment                                      |
| [`[folder]`](#dynamic-route)                 | Dynamic Route            | `app/blog/[slug]/`      | A segment whose value is known only at runtime           |
| [`[...folder]`](#catch-all-route)            | Catch-All Route          | `app/docs/[...path]/`   | Captures one or more path segments as an array           |
| [`[[...folder]]`](#optional-catch-all-route) | Optional Catch-All Route | `app/docs/[[...path]]/` | Like catch-all, but also matches zero segments           |
| [`(folder)`](#route-group)                   | Route Group              | `app/(marketing)/`      | Groups routes for organization — invisible in the URL    |
| [`_folder`](#private-folder)                 | Private Folder           | `app/_components/`      | Excluded from routing entirely                           |
| [`@folder`](#parallel-routes)                | Parallel Route           | `app/@modal/`           | Named slot rendered simultaneously in the same layout    |
| [`(.)folder`](#intercepting-routes)          | Intercepting Route       | `app/(.)image/`         | Intercepts internal navigation to show alternate content |

---

### Regular Route

A plain folder name creates a URL segment of the same name. Add a `page.tsx` inside to make it a renderable route.

```
app/
├── page.tsx         →  "/"
├── about/
│   └── page.tsx     →  "/about"
└── contact/
    └── page.tsx     →  "/contact"
```

---

### Dynamic Route

Wrap a folder name in square brackets (`[slug]`) to create a **dynamic route segment** — a segment whose value isn't known until runtime (e.g. a blog post slug, a user ID, a product ID).

The placeholder name between the brackets (e.g. `slug`) becomes a key in the `params` prop passed to the page component.

```
app/
└── blog/
    └── [slug]/
        └── page.tsx   →  "/blog/:slug"  (e.g. "/blog/hello-world")
```

```tsx
// app/blog/[slug]/page.tsx

interface Props {
  params: { slug: string };
}

export default function BlogPostPage({ params: { slug } }: Props) {
  return (
    <article>
      <h1>Post: {slug}</h1>
    </article>
  );
}
```

> **Multiple dynamic segments** are supported in the same path: `app/shop/[category]/[productId]/page.tsx` → `/shop/:category/:productId`

> **Nested routes inherit params:** Any route nested inside a dynamic segment has access to that segment's params. For example, `app/news/[slug]/image/page.tsx` (a static sub-route inside a dynamic segment) will still receive `params.slug` in its props.

---

### Catch-All Route

Adding `...` inside the brackets (`[...slug]`) captures **one or more** path segments as an array. Useful when you need a varying number of URL segments — for example, a date-based archive like `/archive/2024/03/15`.

```
app/
└── archive/
    └── [...slug]/
        └── page.tsx   →  "/archive/2024", "/archive/2024/03", "/archive/2024/03/15"
                          ❌ does NOT match "/archive" (requires at least 1 segment)
```

```tsx
// app/archive/[...slug]/page.tsx

export default function ArchivePage({ params }: { params: { slug: string[] } }) {
  const [year, month, day] = params.slug;
  // visiting "/archive/2024/03" → params.slug = ["2024", "03"]
  // visiting "/archive/2024/03/15" → params.slug = ["2024", "03", "15"]

  return <p>Showing archive for: {params.slug.join(" / ")}</p>;
}
```

---

### Optional Catch-All Route

Double brackets (`[[...slug]]`) make the catch-all **optional** — it matches zero or more segments, including the root path with no extra segments.

```
app/
└── archive/
    └── [[...slug]]/
        └── page.tsx   →  "/archive", "/archive/2024", "/archive/2024/03", etc.
```

> **Conflict warning:** If you have both `app/archive/page.tsx` and `app/archive/[[...slug]]/page.tsx`, Next.js will throw an error:
> 
> ```
> You cannot define a route with the same specificity as an optional catch-all route.
> ```
> 
> `[[...slug]]` already handles the `/archive` path (zero segments), so a separate `page.tsx` at the same level is redundant and ambiguous. **Remove `app/archive/page.tsx`** and let `[[...slug]]` handle it — check for an empty `params.slug` array instead:


```tsx
// app/archive/[[...slug]]/page.tsx

export default function ArchivePage({ params }: { params: { slug?: string[] } }) {
  if (!params.slug || params.slug.length === 0) {
    return <p>Showing all archived content</p>; // matches "/archive"
  }

  return <p>Showing archive for: {params.slug.join(" / ")}</p>;
}
```

---

### Route Group

Wrapping a folder name in parentheses (`(marketing)`) creates a **route group**. The folder is used for **organization only** — it does not appear in the URL.

Useful for: 

- Grouping related routes without affecting the URL structure.
- Applying a shared layout to a subset of routes without nesting them in the URL.

```
app/
├── (marketing)/
│   ├── layout.tsx       →  shared layout for marketing pages only
│   ├── about/
│   │   └── page.tsx     →  "/about"   (not "/marketing/about")
│   └── pricing/
│       └── page.tsx     →  "/pricing"
└── (app)/
    ├── layout.tsx        →  shared layout for app pages only
    └── dashboard/
        └── page.tsx      →  "/dashboard"
```

> **Important constraint:** Once you introduce route groups at a level, **all** routes at that level must belong to a group. You cannot mix grouped and ungrouped routes at the same level.
> 
> Route groups create parallel root layout trees. Next.js needs to know which root layout owns special files like `page.tsx`, `layout.tsx`, `not-found.tsx`, `loading.tsx`, and `error.tsx`. If some routes are grouped and others are not, ownership becomes ambiguous and Next.js will throw an error.

```
❌ Invalid — mixing grouped and ungrouped at the same level
app/
├── (marketing)/
│   └── about/
│       └── page.tsx
└── not-found.tsx     ← ambiguous: which group does this belong to?

✅ Valid — all routes at this level are inside a group
app/
├── (marketing)/
│   ├── not-found.tsx  ← clearly belongs to the marketing group
│   └── about/
│       └── page.tsx
└── (app)/
    ├── not-found.tsx  ← clearly belongs to the app group
    └── dashboard/
        └── page.tsx
```

---

### Private Folder

Prefixing a folder with an underscore (`_components`) **opts it out of routing entirely**. Next.js will never treat it as a route segment. Use this for co-locating utilities, helpers, or UI components alongside your routes.

```
app/
├── _components/
│   ├── Button.tsx       →  not a route, just a component
│   └── Card.tsx
├── _lib/
│   └── db.ts            →  not a route, just a utility
└── page.tsx             →  "/"
```

---
### Parallel Routes

Parallel routes let you render **multiple independent route segments simultaneously on the same page** — for example, a stats panel and a feed side by side, or a modal layered on top of existing content.

To set up parallel routing:

1. Add a `layout.tsx` to the folder where you want parallel content.
2. Add one `@`-prefixed subfolder per parallel slot.
3. The layout receives each slot as a named prop (the name after `@`), instead of the usual `children`.

```
app/archive/
├── layout.tsx       →  receives "archive" and "latest" as props
├── @archive/
│   └── page.tsx     →  content for the archive slot
└── @latest/
    └── page.tsx     →  content for the latest slot
```

```tsx
// app/archive/layout.tsx

import React from "react";

interface Props {
  archive: React.ReactNode;
  latest: React.ReactNode;
}

const ArchiveLayout = ({ archive, latest }: Props) => {
  return (
    <div>
      <h1>Archived News</h1>
      <section id="archive-filter">{archive}</section>
      <section id="archive-latest">{latest}</section>
    </div>
  );
};

export default ArchiveLayout;
```

> **Note:** When using parallel routes, the layout does **not** receive a `children` prop automatically unless you also have a `page.tsx` directly in the same folder as the layout. That `page.tsx` is still made available as `children` — you can use it alongside the named slots.

#### The `default.tsx` fallback problem

Each parallel slot operates **independently**. If one slot has a nested route (e.g. `@archive/[year]/page.tsx`) and you navigate to `/archive/2024`, the `@latest` slot has no matching page for that path — so Next.js doesn't know what to render for it.

If you then **reload the page**, Next.js can't recover the slot state from the URL alone and will show a 404.

Fix this by adding a `default.tsx` to any slot that doesn't have a matching page for nested paths. It acts as the fallback content for that slot when no more-specific page matches:

```tsx
// app/archive/@latest/default.tsx
// Shown when @latest has no specific page for the current URL

export { default } from "./page"; // reuse the same content as page.tsx
// — or define separate fallback content:

export default function Default() {
  return <p>Select an archive entry to see details.</p>;
}
```

```
app/archive/
├── layout.tsx
├── @archive/
│   ├── page.tsx          →  shown at "/archive"
│   └── [year]/
│       └── page.tsx      →  shown at "/archive/2024"
└── @latest/
    ├── page.tsx           →  shown at "/archive"
    └── default.tsx        →  ← fallback shown at "/archive/2024" (no matching page here)
```

---

### Intercepting Routes

Intercepting routes let you show **different content for the same URL** depending on how the user got there:

- **Navigating via an internal link** (SPA mode) → the intercepting route is shown instead
- **Hard reload / direct URL / external link** → the real route is shown as normal

This is the mechanism behind patterns like clicking a photo in a grid to open it in a modal, while visiting the same URL directly shows a full-page view.

To create an intercepting route, create a sibling folder to the segment you want to intercept and prefix it with a dot-notation that mirrors the relative path — just like a relative import:

| Prefix            | Intercepts                                   |
| ----------------- | -------------------------------------------- |
| `(.)segment`      | A segment at the **same level**              |
| `(..)segment`     | A segment **one level up**                   |
| `(..)(..)segment` | A segment **two levels up**                  |
| `(...)segment`    | A segment from the **root** `app/` directory |

```
app/news/
├── page.tsx                    →  "/news" — news list
├── [slug]/
│   └── page.tsx                →  "/news/[slug]" — full article page (direct visit)
└── (.)image/
    └── page.tsx                →  intercepts "/news/[slug]/image" when navigating internally
```

> For more detail and examples, see the [Next.js docs on Intercepting Routes](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes).

---

### Combining Parallel & Intercepting Routes

The most powerful use of intercepting routes is combining them with parallel routes to create **modal patterns**: clicking a link opens content in a modal (intercepted route), but navigating directly or reloading shows the full page.

**Example — image modal:**

```
app/news/[slug]/
├── layout.tsx          →  receives "children" and "modal" props
├── page.tsx            →  full article page
├── image/
│   └── page.tsx        →  full-page image view (direct visit / reload)
└── @modal/
    ├── default.tsx     →  renders null (modal is closed by default)
    └── (.)image/
        └── page.tsx    →  modal image view (intercepted internal navigation)
```

```tsx
// app/news/[slug]/layout.tsx

import React from "react";

interface Props {
  /**
   * The page.tsx in the same folder is available as children.
   * This is an alternative to creating a dedicated parallel route(e.g. @children).
   */
  children: React.ReactNode;
  modal: React.ReactNode;
}

const NewsDetailsLayout = ({ children, modal }: Props) => {
  return (
    <>
      {modal}   {/* renders the modal when intercepted, null otherwise */}
      {children}
    </>
  );
};

export default NewsDetailsLayout;
```

> **Why `(.)` and not `(..)`?** Even though `@modal/(.)image` is physically inside a subfolder, parallel route folders (`@modal`) are **invisible to the URL**. Next.js resolves the interception prefix against the URL path, not the filesystem path. Since `image` is a sibling in the URL (both live under `/news/[slug]/`), `(.)` is correct.

---

## Navigation Utilities

These are hooks and functions from `next/navigation` used to read or control the current route programmatically.

### `usePathname`

A Client Component hook that returns the **current URL pathname** as a string. Useful for highlighting active navigation links, conditionally rendering UI based on the current route, etc.

```tsx
// components/nav-link.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: Props) => {
  const path = usePathname();

  return (
    <Link
      href={href}
      className={path.startsWith(href) ? "active" : undefined}
    >
      {children}
    </Link>
  );
};

export default NavLink;
```

> **Note:** `usePathname` only returns the pathname portion of the URL (e.g. `/blog/hello-world`), not the full URL including query string or hash.

---

### `useRouter`

A Client Component hook that gives you programmatic control over navigation. Use it when you need to navigate in response to an event that isn't a direct link click — for example, after a form submission, a timeout, or a button action.

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button onClick={() => router.back()}>← Go Back</button>
  );
}
```

**Key methods:**

|Method|Description|
|---|---|
|`router.push(href)`|Navigate to a new route, adding to the browser history|
|`router.replace(href)`|Navigate without adding to browser history|
|`router.back()`|Go back one entry in the browser history|
|`router.forward()`|Go forward one entry in the browser history|
|`router.refresh()`|Re-fetch the current page's Server Components without a full reload. Useful for refreshing data after a mutation.|
|`router.prefetch(href)`|Manually prefetch a route for faster navigation|

> **Prefer `<Link>` over `useRouter.push()`** for standard navigation. `<Link>` automatically prefetches the destination page and is more accessible. Use `useRouter` only when you need programmatic or conditional navigation.

---

### Other Navigation Utilities

|Hook / Function|Type|Description|
|---|---|---|
|`useSearchParams()`|Hook (Client)|Returns the current URL query string as a `ReadonlyURLSearchParams` object|
|`useParams()`|Hook (Client)|Returns the dynamic route params for the current route (e.g. `{ slug: "hello" }`)|
|`redirect(href)`|Function (Server)|Redirects to another route from a Server Component or Server Action. Throws internally — must be called outside try/catch.|
|`notFound()`|Function (Server)|Triggers the nearest `not-found.tsx`. Same rules as `redirect()`.|
|`permanentRedirect(href)`|Function (Server)|Like `redirect()` but returns a 308 instead of 307|