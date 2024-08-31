/**
 * An array of routes that are accessible to the public
 * These routes do not required authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = [
  "/",
  "/auth/new-verification",
  "/auth/signin",
  "/auth/signup",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in user to profile or home
 * @type {string[]}
 */
export const authRoutes: string[] = [
  "/auth/signin",
  "/auth/signup",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * The prefix for api authentication routes
 * routes start with these prefix are used for api aithentication
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * Default redirect path after loggin in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/profile";
