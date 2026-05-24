# App Router

> Next.js file-based routing system built on React Server Components.

---

## Table of Contents

- [Introduction](#introduction)
- [How It Works](#how-it-works)
- [Reserved Filenames](#reserved-filenames)
- [Folder Naming Conventions](#folder-naming-conventions)

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

| File                                                      | Extension                   | Description                                      |
| --------------------------------------------------------- | --------------------------- | ------------------------------------------------ |
| [`page`](#page)                                           | `.js` `.jsx` `.tsx`         | Renders the UI for a route segment               |
| [`layout`](#layout)                                       | `.js` `.jsx` `.tsx`         | Shared UI wrapper around one or more pages       |
| [`generateMetadata`](#dynamic-metadata--generatemetadata) | `.js` `.ts` `.tsx`          | Generates dynamic metadata for pages with params |
| [`loading`](#loading)                                     | `.js` `.jsx` `.tsx`         | Suspense-based loading UI for a segment          |
| [`error`](#error)                                         | `.js` `.jsx` `.tsx`         | Error boundary UI for a segment                  |
| [`not-found`](#not-found)                                 | `.js` `.jsx` `.tsx`         | UI rendered when `notFound()` is thrown          |
| [`template`](#template)                                   | `.js` `.jsx` `.tsx`         | Like layout, but re-mounts on navigation         |
| [`default`](#default)                                     | `.js` `.jsx` `.tsx`         | Fallback UI for parallel routes                  |
| [`route`](#route)                                         | `.js` `.ts`                 | API endpoint (server-side route handler)         |
| [`middleware`](#middleware)                               | `.js` `.ts`                 | Runs before a request is completed               |
| [`icon`](#icon)                                           | `.ico` `.jpg` `.png` `.svg` | Favicon for the app                              |
| [`opengraph-image`](#opengraph-image)                     | `.jpg` `.png` `.gif`        | Open Graph image for social sharing              |
| [`sitemap`](#sitemap)                                     | `.js` `.ts` `.xml`          | Generates a sitemap                              |
| [`robots`](#robots)                                       | `.js` `.ts` `.txt`          | Generates a `robots.txt` file                    |

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
> 
> **`metadata`** is a reserved export name. Exporting it from a layout or page sets `<title>`, `<meta>` tags, etc. automatically — no `<head>` tag needed.

---

### Dynamic Metadata — `generateMetadata`

For **static pages**, metadata is set by exporting a `metadata` constant (see [`layout`](https://claude.ai/chat/4a90f693-e675-419a-9729-f46c2debd532#layout)). For **dynamic pages** where the metadata depends on route params or fetched data, export an async function named `generateMetadata` instead.

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

Creates a **server-side API endpoint** (like an Express route). Supports `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, and `OPTIONS`. Cannot coexist with a `page.tsx` in the same folder.

```ts
// app/api/hello/route.ts  →  GET /api/hello

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello from the API!" });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

---

### `middleware`

Runs **before a request is completed**, allowing you to rewrite, redirect, add headers, or check auth. Lives at the root of the project (next to `app/`), not inside `app/`.

```ts
// middleware.ts  (project root, not inside app/)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("token");

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // only run on these paths
};
```

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

| Folder Pattern                               | Example                 | Description                                           |
| -------------------------------------------- | ----------------------- | ----------------------------------------------------- |
| [`folder`](#regular-route)                   | `app/about/`            | Regular route segment                                 |
| [`[folder]`](#dynamic-route)                 | `app/blog/[slug]/`      | Dynamic route segment                                 |
| [`[...folder]`](#catch-all-route)            | `app/docs/[...path]/`   | Catch-all route (one or more segments)                |
| [`[[...folder]]`](#optional-catch-all-route) | `app/docs/[[...path]]/` | Optional catch-all (zero or more segments)            |
| [`(folder)`](#route-group)                   | `app/(marketing)/`      | Route group — groups routes without affecting the URL |
| [`_folder`](#private-folder)                 | `app/_components/`      | Private folder — excluded from routing entirely       |
| [`@folder`](#parallel-route)                 | `app/@modal/`           | Named slot for parallel routes                        |

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

---

### Catch-All Route

Adding `...` inside the brackets (`[...slug]`) captures **one or more** path segments as an array.

```
app/
└── docs/
    └── [...path]/
        └── page.tsx   →  "/docs/a", "/docs/a/b", "/docs/a/b/c", etc.
```

```tsx
// app/docs/[...path]/page.tsx

export default function DocsPage({ params }: { params: { path: string[] } }) {
  return <p>Path segments: {params.path.join(" / ")}</p>;
}
// visiting "/docs/routing/dynamic" → params.path = ["routing", "dynamic"]
```

---

### Optional Catch-All Route

Double brackets (`[[...slug]]`) make the catch-all **optional** — it also matches the root segment (zero segments).

```
app/
└── docs/
    └── [[...path]]/
        └── page.tsx   →  "/docs", "/docs/a", "/docs/a/b", etc.
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
│   ├── layout.tsx       →  shared layout for marketing pages
│   ├── about/
│   │   └── page.tsx     →  "/about"   (not "/marketing/about")
│   └── pricing/
│       └── page.tsx     →  "/pricing"
└── (app)/
    ├── layout.tsx        →  shared layout for app pages
    └── dashboard/
        └── page.tsx      →  "/dashboard"
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

### Parallel Route

Folders prefixed with `@` define **named slots** for parallel routes — a way to render multiple pages simultaneously within the same layout (e.g. a sidebar + a main content area, or a modal overlay).

```
app/
├── layout.tsx           →  receives both @feed and @modal as props
├── @feed/
│   └── page.tsx         →  rendered in the "feed" slot
└── @modal/
    ├── page.tsx          →  rendered in the "modal" slot
    └── default.tsx       →  fallback when modal is inactive
```

```tsx
// app/layout.tsx
export default function Layout({
  children,
  feed,
  modal,
}: {
  children: React.ReactNode;
  feed: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {feed}
      {modal}
      {children}
    </>
  );
}
```