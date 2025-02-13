export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();
  console.log('middleware', user.value);

  //
});
