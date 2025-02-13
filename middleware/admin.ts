export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  try {
    // Force refresh the session
    const {
      data: { session },
      error: refreshError,
    } = await supabase.auth.refreshSession();

    if (refreshError) {
      console.error('Session refresh error:', refreshError);
      return navigateTo('/auth');
    }

    if (!session) {
      console.error('No session found');
      return navigateTo('/auth');
    }

    // Debug logging
    console.group('Auth State');
    console.log('Session exists:', !!session);
    console.log('Access Token:', !!session.access_token);
    console.log('User:', session.user);
    console.log('Role:', session.user.user_metadata?.role);
    console.groupEnd();

    // Verify role
    if (session.user.user_metadata?.role !== 'admin') {
      console.error('Not an admin');
      return navigateTo('/');
    }

    // Test database access
    const { data: testData, error: testError } = await supabase
      .from('Question')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('Database test failed:', testError);
      throw testError;
    }
  } catch (error) {
    console.error('Admin middleware error:', error);
    return navigateTo('/');
  }
});
