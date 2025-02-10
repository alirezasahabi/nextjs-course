/**
 * We should set up our middleware in the root project folder & not in the "app" folder.
 * There we create a file named "middleware" which is a reserved name in NextJS.
 * In there we should export a function called "middleware".
 *
 * Middleware does allow us to set up a code that will run on every request that's
 * sent to any page, any route anywhere in our website.
 */

import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

/**
 * This function will get a request object passed automatically by NextJS.
 * We also have to return a "NextResponse".
 */
export function middleware(request: NextRequest) {
  /**
   * If we log this "request" object, check the terminal
   * if we load a page, we can see all the requests including fav icon,
   * images from public folder, the page we just load.
   * console.log(request);
   */

  /**
   * Here, we can change inspect, block a request, redirect & etc.
   *
   * We can also intantiate it to create a new response from scratch.
   * return new NextResponse()
   *
   * This "NextResponse" have various methods. Ex:
   * next: Forwards the incoming request to its actual destination.
   * redirect: Redirects the user to another page.
   */
  return NextResponse.next();
}

/**
 * We can also export an object named "config".
 * In there we can set up a matcher property.
 * This will allows up to filter the kind of requests that trigger the middleware.
 * More info https://nextjs.org/docs/app/building-your-application/routing/middleware
 */
export const config: MiddlewareConfig = {
  matcher: "/news",
};
