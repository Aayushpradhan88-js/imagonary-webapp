import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

//----------My Public Routes----------//
const isPublicRoutes = [
    "/signin",
    "/sign-up",
    "/",
    "/home"
]

//---------Public API Routes----------//
const isPublicApiRoutes = [
    "/api/videos"
]

export default clerkMiddleware((auth, req) => {
    const {userId} = auth();
    const currentUrl = new URL(req.url);
    const isAccessingDashboard = currentUrl.pathname === '/home';
    const isApiRequest = currentUrl.pathname.startsWith('/api');

    if(userId && )
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}