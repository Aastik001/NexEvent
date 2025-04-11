import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in',
  '/sign-up',
  '/events/:id',
  '/api/webhook/clerk',
  '/api/webhook/stripe',
  '/api/uploadthing',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return; // Public route — no auth needed
  }

  const { userId } = await auth();

  if (!userId) {
    return Response.redirect(new URL('/sign-in', req.url));
  }

  // User is signed in — continue
});

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|.*\\..*).*)',
    '/(api|trpc)(.*)',
  ],
};
