/**
 * "page" file name tells NextJS that it should render a page.
 */

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
    </main>
  );
}
