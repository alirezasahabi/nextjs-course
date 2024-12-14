/**
 * "page" file name tells NextJS that it should render a page.
 */

import Link from "next/link";

/**
 * It's regular React component but treated in a special way by NextJS.
 * It's treated as a server component & executed on the server.
 */

export default function Home() {
  /**
   * We can see this on the back-end, in the terminal that we're running the app next to other server logs.
   * Or in the console like this: Server Hoy!
   * console.log("Hoy!");
   */

  return (
    <main>
      <img src="/logo.png" alt="A server surrounded by magic sparkles." />
      <h1>Welcome to this NextJS Course!</h1>
      <p>🔥 Let&apos;s get started! 🔥</p>
      <p>
        {/* <a href="/about">About</a> */}
        {/**
         * A component provided by the NextJS which we should use
         * instead of the "anchor" element, if we have a link that
         * leads to another page of our website.
         * By using this, it ensures that we stay in that single-page app.
         */}
        <Link href="/about">About</Link>
      </p>
    </main>
  );
}
