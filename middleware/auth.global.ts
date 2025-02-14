export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();

  // Public routes (no auth required)
  const publicPaths = [
    '/',
    '/auth',
    '/student', // This will match the base students route
  ];

  // Check if path starts with /students/
  const isStudentRoute = to.path.startsWith('/student/');

  // Check if path is public
  const isPublicPath = publicPaths.includes(to.path) || isStudentRoute;

  // Allow access to public routes
  if (isPublicPath) return;

  // Require authentication for all other routes
  if (!user.value) {
    return navigateTo(`/auth?redirect=${encodeURIComponent(to.fullPath)}`);
  }
});
