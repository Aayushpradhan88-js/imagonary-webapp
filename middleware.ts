import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

//----------ROUTES----------//
const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/",
  "/home"
])
const isPublicApiRoute = createRouteMatcher([
  "/api/videos"
])

//----------USER CLERK AUTH MIDDLEWARE----------//
export default clerkMiddleware(async(auth, req) => {
  const { userId } = await auth();
  const currentUrl = new URL(req.url)
  const isAccessingDashboard = currentUrl.pathname === "/home"
  const isApiRequest = currentUrl.pathname.startsWith("/api")

  //----------If user is logged in and accessing a public route but not the dashboard----------//
  if (userId && isPublicRoute(req) && !isAccessingDashboard) {
    return NextResponse.redirect(new URL("/home", req.url))
  }

  //----------not logged in-----------//
  if (!userId) {
    //-----If user is not logged in & trying to access a protected route-----//
    if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }

    //-----------If the request is for a protected API and the user is not logged in----------//
    if (isApiRequest && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    };
  };

  return NextResponse.next();

});


//----------MATCHERS----------//
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};