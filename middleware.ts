import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

//----------My Public Routes----------//
const isPublicRoutes = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/",
  "/home"
])

//---------Public API Routes----------//
const isPublicApiRoutes = createRouteMatcher([
  "/api/videos"
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const currentUrl = new URL(req.url);
  const isAccessingDashboard = currentUrl.pathname === '/home';
  const isApiRequest = currentUrl.pathname.startsWith('/api');
  /*
  shortcuts
  - R = Rule
  */

  //-----R-1 Already logged logged in getting the user's ID-----//
  if (userId && isPublicRoutes(req) && !isAccessingDashboard) {
    return NextResponse.redirect(new URL("/home", req.url));
  };

  //-----Not logged in-----//
  if (!userId) {
    if (!isPublicApiRoutes(req) && !isPublicRoutes(req)) {
      return NextResponse.redirect(new URL("sign-in", req.url));
    };
  };

  if (isApiRequest && !isPublicApiRoutes(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  };
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}