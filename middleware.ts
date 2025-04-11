import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/events/:id',
  '/api/webhook/clerk',
  '/api/webhook/stripe',
  '/api/uploadthing',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return; // Allow access
  }

  const { userId } = await auth();

  if (!userId) {
    // Redirect unauthenticated users
    return Response.redirect(new URL('/sign-in', req.url));
  }

  // Allow access for signed-in users
});
export const config = {
  matcher: [
    '/((?!_next|favicon.ico|.*\\..*).*)',
    '/(api|trpc)(.*)',
  ],
};
