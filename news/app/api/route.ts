import { NextRequest } from "next/server";

/**
 * We create a folder called 'api'(common convention, not required).
 * Under this folder we can have various endpoints.
 * We should create a file named 'route.ts/js'.
 * This sets up a "Rotue Handler".
 
* A route handler is a file in which we can export various functions
 * which must named: GET | POST | PATCH | PUT | DELETE
 * (Must have an HTTP method name.)
 * 
 * The idea behind these route handlers is that we can set up API like routes
 * which produce, store data, do whatever we need to do, but which essentially
 * are called behind scenes from some client.
 * 
 * We can set up multiple route handlers in a same file for handling different kinds of requests.
 * 
 * NOTE: In a given folder or URL segment, we can either have 'page' or 'route' file.
 *       If we wanna show something to the user(markup, HTML content) we use a 'page' file,
 *       for handling HTTP request we use a 'route' file.
 * 
 * These route handlers will automatically receive a request object(passed by NextJS)
 * 
 * In general we might not need this feature to often when building a NextJS app,
 * but it can be helpful, especially if we want to connect to other clients to our app
 * for ex: some moblie apps, ...
 */
export function GET(request: NextRequest) {
//   console.log(request);

  return new Response("Hoy!");
  //   return Response("Hoy!");
}
